import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

describe('GET /api/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return published posts with default pagination', async () => {
    const mockPosts: any[] = [
      {
        id: '1',
        title: 'First Post',
        slug: 'first-post',
        excerpt: 'First excerpt',
        published: true,
        created_at: '2024-01-01',
      },
    ];

    const mockBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: mockPosts, error: null }))),
      catch: vi.fn().mockReturnThis(),
    };

    const mockSupabaseClient = {
      from: vi.fn(() => mockBuilder),
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/posts');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('posts');
    expect(Array.isArray(data.posts)).toBe(true);
  });

  it('should support pagination query parameters', async () => {
    const mockPosts: any[] = [];

    const mockBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: mockPosts, error: null }))),
      catch: vi.fn().mockReturnThis(),
    };

    const mockSupabaseClient = {
      from: vi.fn(() => mockBuilder),
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/posts?page=2&limit=20');
    const response = await GET(request);

    expect(response.status).toBe(200);
  });

  it('should support search query parameter', async () => {
    const mockBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], error: null }))),
      catch: vi.fn().mockReturnThis(),
    };

    const mockSupabaseClient = {
      from: vi.fn(() => mockBuilder),
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/posts?q=typescript');
    const response = await GET(request);

    expect(response.status).toBe(200);
  });

  it('should support category filter', async () => {
    const mockBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: [], error: null }))),
      catch: vi.fn().mockReturnThis(),
    };

    const mockSupabaseClient = {
      from: vi.fn(() => mockBuilder),
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/posts?category=tech');
    const response = await GET(request);

    expect(response.status).toBe(200);
  });

  it('should return 500 on database error', async () => {
    const mockBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      then: vi.fn((cb: any) => Promise.resolve(cb({ data: null, error: new Error('DB error') }))),
      catch: vi.fn().mockReturnThis(),
    };

    const mockSupabaseClient = {
      from: vi.fn(() => mockBuilder),
    };

    (createClient as any).mockResolvedValue(mockSupabaseClient);

    const request = new NextRequest('http://localhost:3000/api/posts');
    const response = await GET(request);

    expect(response.status).toBe(500);
  });
});
