import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminAuth } from '@/lib/auth/admin';
import { updatePostSchema } from '@/lib/validations/post';
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
      .from('posts')
      .select('*, categories:post_categories(categories(id, name, slug))')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin post detail API error:', error);
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
    const validation = updatePostSchema.safeParse(body);
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
    if (validation.data.content !== undefined) updateData.content = validation.data.content;
    if (validation.data.excerpt !== undefined) updateData.excerpt = validation.data.excerpt;
    if (validation.data.cover_image_url !== undefined) updateData.cover_image_url = validation.data.cover_image_url;
    if (validation.data.published !== undefined) {
      updateData.published = validation.data.published;
      updateData.published_at = validation.data.published ? new Date().toISOString() : null;
    }

    const { data: post, error: updateError } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Update categories if provided
    if (validation.data.category_ids !== undefined) {
      // Delete existing category links
      await supabase.from('post_categories').delete().eq('post_id', id);

      // Add new category links
      if (validation.data.category_ids.length > 0) {
        const categoryLinks = validation.data.category_ids.map(category_id => ({
          post_id: id,
          category_id,
        }));

        await supabase.from('post_categories').insert(categoryLinks);
      }
    }

    // Fetch the complete post with categories
    const { data: completePost } = await supabase
      .from('posts')
      .select('*, categories:post_categories(categories(id, name, slug))')
      .eq('id', id)
      .single();

    return NextResponse.json(completePost);
  } catch (error) {
    console.error('Admin post update API error:', error);
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

    // Delete category links first
    await supabase.from('post_categories').delete().eq('post_id', id);

    // Delete the post
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin post delete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
