import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminAuth } from '@/lib/auth/admin';
import { createProjectSchema } from '@/lib/validations/project';
import slugify from 'slugify';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Admin projects API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      projects: data || [],
    });
  } catch (error) {
    console.error('Admin projects API error:', error);
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
    const validation = createProjectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.issues },
        { status: 400 }
      );
    }

    const slug = slugify(validation.data.title, { lower: true, strict: true });
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: validation.data.title,
        slug,
        description: validation.data.description,
        content: validation.data.content || {},
        tech_stack: validation.data.tech_stack,
        live_url: validation.data.live_url,
        github_url: validation.data.github_url,
        image_url: validation.data.image_url,
        featured: validation.data.featured,
        display_order: validation.data.display_order,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create project:', error);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Admin projects API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
