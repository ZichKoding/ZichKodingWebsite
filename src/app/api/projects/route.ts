import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');

    const supabase = await createClient();

    let query = supabase.from('projects').select('*');

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query.order('display_order', { ascending: true });

    if (error) {
      console.error('Projects API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      projects: data || [],
    });
  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
