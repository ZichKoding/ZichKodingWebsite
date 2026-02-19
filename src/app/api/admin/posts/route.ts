import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminAuth } from '@/lib/auth/admin';
import { createPostSchema } from '@/lib/validations/post';
import slugify from 'slugify';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*, categories:post_categories(categories(id, name, slug))')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin posts API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      posts: data || [],
    });
  } catch (error) {
    console.error('Admin posts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const body = await request.json();

    // Validate input
    const validation = createPostSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.issues },
        { status: 400 }
      );
    }

    const slug = slugify(validation.data.title, { lower: true, strict: true });
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        title: validation.data.title,
        slug,
        content: validation.data.content,
        excerpt: validation.data.excerpt,
        cover_image_url: validation.data.cover_image_url,
        published: validation.data.published,
        published_at: validation.data.published ? new Date().toISOString() : null,
        author_id: user.user.id,
      })
      .select()
      .single();

    if (postError) {
      console.error('Failed to create post:', postError);
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }

    // Link categories
    if (validation.data.category_ids.length > 0) {
      const categoryLinks = validation.data.category_ids.map(category_id => ({
        post_id: post.id,
        category_id,
      }));

      const { error: linkError } = await supabase
        .from('post_categories')
        .insert(categoryLinks);

      if (linkError) {
        console.error('Failed to link categories:', linkError);
      }
    }

    // Fetch the complete post with categories
    const { data: completePost } = await supabase
      .from('posts')
      .select('*, categories:post_categories(categories(id, name, slug))')
      .eq('id', post.id)
      .single();

    return NextResponse.json(completePost, { status: 201 });
  } catch (error) {
    console.error('Admin posts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
