'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/lib/supabase/types';

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('posts').insert([
        {
          ...data,
          author_id: user.id,
          published_at: data.published ? new Date().toISOString() : null,
        },
      ]);

      if (error) throw error;

      // Add category relationships
      const postResponse = await supabase
        .from('posts')
        .select('id')
        .eq('slug', data.slug)
        .single();

      if (postResponse.data && data.category_ids.length > 0) {
        await supabase.from('post_categories').insert(
          data.category_ids.map((category_id: string) => ({
            post_id: postResponse.data.id,
            category_id,
          }))
        );
      }

      router.push('/admin/posts');
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to create post'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-100">Create New Post</h1>
        <p className="mt-2 text-gray-400">
          Write and publish a new blog post
        </p>
      </div>

      <div className="max-w-4xl">
        <PostForm
          categories={categories}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
