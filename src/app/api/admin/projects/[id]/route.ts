import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminAuth } from '@/lib/auth/admin';
import { updateProjectSchema } from '@/lib/validations/project';
import slugify from 'slugify';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await requireAdminAuth();
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin project detail API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await requireAdminAuth();
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const body = await request.json();

    // Validate input
    const validation = updateProjectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.issues },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const updateData: any = {};
    if (validation.data.title !== undefined) {
      updateData.title = validation.data.title;
      updateData.slug = slugify(validation.data.title, { lower: true, strict: true });
    }
    if (validation.data.description !== undefined) updateData.description = validation.data.description;
    if (validation.data.content !== undefined) updateData.content = validation.data.content;
    if (validation.data.tech_stack !== undefined) updateData.tech_stack = validation.data.tech_stack;
    if (validation.data.live_url !== undefined) updateData.live_url = validation.data.live_url;
    if (validation.data.github_url !== undefined) updateData.github_url = validation.data.github_url;
    if (validation.data.image_url !== undefined) updateData.image_url = validation.data.image_url;
    if (validation.data.featured !== undefined) updateData.featured = validation.data.featured;
    if (validation.data.display_order !== undefined) updateData.display_order = validation.data.display_order;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin project update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await requireAdminAuth();
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin project delete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
