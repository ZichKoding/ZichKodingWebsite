import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

describe('GET /api/categories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return categories with post counts', async () => {
    const mockCategories = [
      {
        id: '1',
        name: 'Technology',
        slug: 'technology',
        description: 'Tech posts',
        created_at: '2024-01-01',
        post_count: 5,
      },
      {
        id: '2',
        name: 'Design',
        slug: 'design',
        description: 'Design posts',
        created_at: '2024-01-02',
        post_count: 3,
      },
    ];

    const mockBuilder = {
      select: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: mockCategories, error: null }))),
      catch: vi.fn().mockReturnThis(),
    };

    const mockSupabaseClient = {
      from: vi.fn(() => mockBuilder),
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/categories');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('categories');
    expect(Array.isArray(data.categories)).toBe(true);
  });

  it('should return empty array when no categories exist', async () => {
    const mockBuilder = {
      select: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], error: null }))),
      catch: vi.fn().mockReturnThis(),
    };

    const mockSupabaseClient = {
      from: vi.fn(() => mockBuilder),
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/categories');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.categories).toEqual([]);
  });

  it('should return 500 on database error', async () => {
    const mockBuilder = {
      select: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: null, error: new Error('DB error') }))),
      catch: vi.fn().mockReturnThis(),
    };

    const mockSupabaseClient = {
      from: vi.fn(() => mockBuilder),
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/categories');
    const response = await GET(request);

    expect(response.status).toBe(500);
  });
});
