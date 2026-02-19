'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Post } from '@/lib/supabase/types';
import StatusBadge from '@/components/admin/StatusBadge';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setPosts(posts.filter((post) => post.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading posts...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-100">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          New Post
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-gray-100 placeholder-gray-500 outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No posts found
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-100">{post.title}</p>
                      <p className="text-sm text-gray-400">{post.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={post.published ? 'published' : 'draft'}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                      >
                        <Edit2 size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(post.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmDialog
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
