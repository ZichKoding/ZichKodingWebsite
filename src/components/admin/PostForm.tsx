'use client';

import { useState, useEffect } from 'react';
import slugify from 'slugify';
import TiptapEditor from './TiptapEditor';
import { Post, Category } from '@/lib/supabase/types';

interface PostFormProps {
  initialData?: Post;
  categories: Category[];
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function PostForm({
  initialData,
  categories,
  onSubmit,
  isLoading = false,
}: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(
    initialData?.content
      ? JSON.stringify(initialData.content)
      : JSON.stringify({ type: 'doc', content: [] })
  );
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.cover_image_url || ''
  );
  const [published, setPublished] = useState(initialData?.published || false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [error, setError] = useState('');

  const slug = slugify(title, { lower: true, strict: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onSubmit({
        title,
        slug,
        content: JSON.parse(content),
        excerpt,
        cover_image_url: coverImageUrl || null,
        published,
        category_ids: selectedCategories,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-600 bg-red-900 px-4 py-3 text-red-100">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-200"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          required
        />
        {title && (
          <p className="mt-2 text-sm text-gray-400">Slug: {slug}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium text-gray-200"
        >
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief summary of the post"
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="coverImage"
          className="block text-sm font-medium text-gray-200"
        >
          Cover Image URL
        </label>
        <input
          id="coverImage"
          type="url"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-3">
          Content
        </label>
        <TiptapEditor value={content} onChange={setContent} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-3">
          Categories
        </label>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 rounded-lg border border-gray-600 bg-gray-700 p-3 hover:bg-gray-600"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600"
              />
              <span className="text-gray-200">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-gray-600 bg-gray-700 p-4">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600"
        />
        <label htmlFor="published" className="text-gray-200">
          Publish immediately
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading
          ? 'Saving...'
          : initialData
            ? 'Update Post'
            : 'Create Post'}
      </button>
    </form>
  );
}
