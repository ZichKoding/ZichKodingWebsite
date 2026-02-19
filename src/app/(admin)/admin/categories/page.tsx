'use client';

import { useEffect, useState } from 'react';
import slugify from 'slugify';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/lib/supabase/types';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<
    (Category & { post_count: number })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      // Fetch post counts
      const categoriesWithCounts = await Promise.all(
        (data || []).map(async (category: Category) => {
          const { count } = await supabase
            .from('post_categories')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id);

          return {
            ...category,
            post_count: count || 0,
          };
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim()) return;

    try {
      const slug = slugify(newName, { lower: true, strict: true });

      const { error } = await supabase.from('categories').insert([
        {
          name: newName,
          slug,
          description: newDescription || null,
        },
      ]);

      if (error) throw error;

      setNewName('');
      setNewDescription('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;

    try {
      const slug = slugify(editName, { lower: true, strict: true });

      const { error } = await supabase
        .from('categories')
        .update({
          name: editName,
          slug,
          description: editDescription || null,
        })
        .eq('id', id);

      if (error) throw error;

      setEditingId(null);
      setEditName('');
      setEditDescription('');
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setCategories(categories.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading categories...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-gray-100">Categories</h1>

      {/* Add Category Form */}
      <div className="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-100">
          Add New Category
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-200"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Category name"
                className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-200"
              >
                Description
              </label>
              <input
                id="description"
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Brief description"
                className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Category
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Slug
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Description
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Posts
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  No categories yet
                </td>
              </tr>
            ) : (
              categories.map((category) =>
                editingId === category.id ? (
                  <tr key={category.id} className="border-b border-gray-700">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="space-y-3">
                        <div className="grid gap-3 md:grid-cols-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100"
                          />
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(category.id)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={category.id}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-100">
                        {category.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400">{category.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300">
                        {category.description || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {category.post_count}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(category.id);
                            setEditName(category.name);
                            setEditDescription(category.description || '');
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(category.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmDialog
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
