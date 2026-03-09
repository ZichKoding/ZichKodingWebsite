-- Fix NULL string columns in auth.users that cause GoTrue scan errors
-- GoTrue scans these as Go `string` (not *string), so NULL crashes the scan.
-- Error: "sql: Scan error on column index 8, name "email_change": converting NULL to string is unsupported"
-- Version: 1.0
-- Created: 2026-02-20

-- ============================================================================
-- 1. BACKFILL: Convert all NULLs to empty strings in auth.users
-- ============================================================================

UPDATE auth.users
SET
    encrypted_password         = COALESCE(encrypted_password, ''),
    confirmation_token         = COALESCE(confirmation_token, ''),
    recovery_token             = COALESCE(recovery_token, ''),
    email_change               = COALESCE(email_change, ''),
    email_change_token_new     = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    phone                      = COALESCE(phone, ''),
    phone_change               = COALESCE(phone_change, ''),
    phone_change_token         = COALESCE(phone_change_token, ''),
    reauthentication_token     = COALESCE(reauthentication_token, '')
WHERE
    encrypted_password IS NULL
    OR confirmation_token IS NULL
    OR recovery_token IS NULL
    OR email_change IS NULL
    OR email_change_token_new IS NULL
    OR email_change_token_current IS NULL
    OR phone IS NULL
    OR phone_change IS NULL
    OR phone_change_token IS NULL
    OR reauthentication_token IS NULL;


-- ============================================================================
-- 2. DEFAULTS: Prevent future NULLs on these columns
-- ============================================================================

ALTER TABLE auth.users
    ALTER COLUMN confirmation_token         SET DEFAULT '',
    ALTER COLUMN recovery_token             SET DEFAULT '',
    ALTER COLUMN email_change               SET DEFAULT '',
    ALTER COLUMN email_change_token_new     SET DEFAULT '',
    ALTER COLUMN email_change_token_current SET DEFAULT '',
    ALTER COLUMN phone                      SET DEFAULT '',
    ALTER COLUMN phone_change               SET DEFAULT '',
    ALTER COLUMN phone_change_token         SET DEFAULT '',
    ALTER COLUMN reauthentication_token     SET DEFAULT '';


-- ============================================================================
-- 3. RE-APPLY: handle_new_user() trigger with explicit schema qualification
-- ============================================================================
-- Ensures the live DB has the fixed version with `public.profiles`
-- and `SET search_path = public` (matches 001_initial_schema.sql)

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', now(), now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
