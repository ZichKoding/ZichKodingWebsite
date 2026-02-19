import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';
import { createMockSupabaseClient, mockQueryBuilderResponse } from '@/lib/test-utils/supabase-mock';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should accept a valid contact submission', async () => {
    const mockBuilder = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: { id: '123' }, error: null }))),
      catch: vi.fn().mockReturnThis(),
    };

    const mockSupabaseClient = {
      from: vi.fn(() => mockBuilder),
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I am interested in discussing a potential project with your team.',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
  });

  it('should return 400 for invalid input', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test',
        message: 'Too short',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  it('should return 400 when required fields are missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('should return 500 on database error', async () => {
    const mockBuilder = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: null, error: new Error('DB error') }))),
      catch: vi.fn().mockReturnThis(),
    };

    const mockSupabaseClient = {
      from: vi.fn(() => mockBuilder),
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I am interested in discussing a potential project with your team.',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });

  it('should validate message length constraints', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'a'.repeat(5001),
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('should validate email format', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'not-an-email',
        subject: 'Test',
        message: 'A valid message with enough content.',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
