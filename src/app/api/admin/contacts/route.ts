import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminAuth } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const supabase = await createClient();

    let query = supabase.from('contact_messages').select('*');

    if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
      query = query.eq('status', status as 'new' | 'read' | 'replied' | 'archived');
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Admin contacts API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch contacts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      contacts: data || [],
    });
  } catch (error) {
    console.error('Admin contacts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
