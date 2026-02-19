import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminAuth } from '@/lib/auth/admin';
import { updateSkillSchema } from '@/lib/validations/skill';

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
    const validation = updateSkillSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.issues },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const updateData: any = {};
    if (validation.data.name !== undefined) updateData.name = validation.data.name;
    if (validation.data.category !== undefined) updateData.category = validation.data.category;
    if (validation.data.proficiency !== undefined) updateData.proficiency = validation.data.proficiency;
    if (validation.data.icon !== undefined) updateData.icon = validation.data.icon;
    if (validation.data.display_order !== undefined) updateData.display_order = validation.data.display_order;

    const { data, error } = await supabase
      .from('skills')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin skill update API error:', error);
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

    const { error } = await supabase.from('skills').delete().eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin skill delete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
