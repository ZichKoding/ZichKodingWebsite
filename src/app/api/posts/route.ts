import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizePostgrestInput } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(parseInt(searchParams.get('page') || '1') || 1, 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10') || 10, 1), 50);
    const search = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    const offset = (page - 1) * limit;

    const supabase = await createClient();

    let query = supabase
      .from('posts')
      .select('*, categories:post_categories(categories(id, name, slug))', { count: 'exact' })
      .eq('published', true);

    // Apply search filter
    if (search) {
      const sanitized = sanitizePostgrestInput(search);
      query = query.or(
        `title.ilike.%${sanitized}%,excerpt.ilike.%${sanitized}%`
      );
    }

    // Apply category filter
    if (category) {
      // This is a simplified approach - in production you might need a more sophisticated join
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();

      if (categoryData) {
        const { data: postIds } = await supabase
          .from('post_categories')
          .select('post_id')
          .eq('category_id', categoryData.id);

        if (postIds && postIds.length > 0) {
          query = query.in('id', postIds.map(p => p.post_id));
        } else {
          return NextResponse.json({
            posts: [],
            pagination: { page, limit, total: 0 },
          });
        }
      }
    }

    // Apply sorting and pagination
    const { data, error, count } = await query
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Posts API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      posts: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
      },
    });
  } catch (error) {
    console.error('Posts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
