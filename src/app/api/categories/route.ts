import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*, post_count:post_categories(count)');

    if (error) {
      console.error('Categories API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    // Transform the data to include post counts
    const categoriesWithCounts = (data || []).map((category: any) => ({
      ...category,
      post_count: category.post_count ? category.post_count.length : 0,
    }));

    return NextResponse.json({
      categories: categoriesWithCounts,
    });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
