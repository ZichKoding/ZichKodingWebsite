import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireAdminAuth } from '../admin';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

describe('Admin Auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user when authenticated', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'admin@example.com',
    };

    const mockSupabaseClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const result = await requireAdminAuth();

    expect(result.user).toEqual(mockUser);
    expect(result.error).toBeNull();
    expect(result.response).toBeNull();
  });

  it('should return 401 error when not authenticated', async () => {
    const mockSupabaseClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const result = await requireAdminAuth();

    expect(result.user).toBeNull();
    expect(result.error).toBe('Unauthorized');
    expect(result.response).not.toBeNull();
    if (result.response) {
      expect(result.response.status).toBe(401);
    }
  });

  it('should return 401 error when auth returns an error', async () => {
    const mockSupabaseClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: new Error('Auth error'),
        }),
      },
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const result = await requireAdminAuth();

    expect(result.user).toBeNull();
    expect(result.error).toBe('Unauthorized');
    expect(result.response).not.toBeNull();
  });
});
