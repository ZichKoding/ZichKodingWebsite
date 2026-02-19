'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import { createClient } from '@/lib/supabase/client';
import { Post, Category } from '@/lib/supabase/types';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    Promise.all([fetchPost(), fetchCategories()]).finally(() =>
      setLoading(false)
    );
  }, [postId]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/admin/posts');
    }
  };

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
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const { error: updateError } = await supabase
        .from('posts')
        .update({
          ...data,
          published_at:
            data.published && !post?.published
              ? new Date().toISOString()
              : post?.published_at,
        })
        .eq('id', postId);

      if (updateError) throw updateError;

      // Update category relationships
      await supabase.from('post_categories').delete().eq('post_id', postId);

      if (data.category_ids.length > 0) {
        await supabase.from('post_categories').insert(
          data.category_ids.map((category_id: string) => ({
            post_id: postId,
            category_id,
          }))
        );
      }

      router.push('/admin/posts');
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update post'
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

  if (!post) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Post not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-100">Edit Post</h1>
        <p className="mt-2 text-gray-400">Update your blog post</p>
      </div>

      <div className="max-w-4xl">
        <PostForm
          initialData={post}
          categories={categories}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
