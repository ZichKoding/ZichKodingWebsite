import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function requireAdminAuth() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      error: 'Unauthorized',
      response: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
    };
  }

  return {
    user,
    error: null,
    response: null,
  };
}
