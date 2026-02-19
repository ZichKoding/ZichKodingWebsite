import { describe, it, expect } from 'vitest';
import { createContactSchema, updateContactStatusSchema } from '../contact';

describe('Contact Validation Schemas', () => {
  describe('createContactSchema', () => {
    it('should validate a valid contact submission', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I am interested in discussing a project.',
      };

      const result = createContactSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should require all fields', () => {
      const input = {
        name: 'John Doe',
      };

      const result = createContactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const input = {
        name: 'John Doe',
        email: 'not-an-email',
        subject: 'Test',
        message: 'A valid message with enough content.',
      };

      const result = createContactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should enforce name length constraints', () => {
      const input = {
        name: 'a'.repeat(101),
        email: 'test@example.com',
        subject: 'Test',
        message: 'A valid message with enough content.',
      };

      const result = createContactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should enforce subject length constraints', () => {
      const input = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'a'.repeat(201),
        message: 'A valid message with enough content.',
      };

      const result = createContactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should enforce message minimum length', () => {
      const input = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Short',
      };

      const result = createContactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should enforce message maximum length', () => {
      const input = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: 'a'.repeat(5001),
      };

      const result = createContactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const input = {
        name: '',
        email: 'test@example.com',
        subject: 'Test',
        message: 'A valid message with enough content.',
      };

      const result = createContactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject empty subject', () => {
      const input = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: '',
        message: 'A valid message with enough content.',
      };

      const result = createContactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('updateContactStatusSchema', () => {
    it('should validate status update', () => {
      const input = {
        status: 'read',
      };

      const result = updateContactStatusSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate all valid status values', () => {
      const statuses = ['new', 'read', 'replied', 'archived'];

      statuses.forEach(status => {
        const result = updateContactStatusSchema.safeParse({ status });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid status', () => {
      const input = {
        status: 'invalid',
      };

      const result = updateContactStatusSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should allow admin notes', () => {
      const input = {
        status: 'read',
        admin_notes: 'Responded via email',
      };

      const result = updateContactStatusSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should allow empty admin notes', () => {
      const input = {
        status: 'replied',
      };

      const result = updateContactStatusSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });
});
