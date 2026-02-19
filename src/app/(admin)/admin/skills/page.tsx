'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Skill } from '@/lib/supabase/types';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Trash2, Plus, Edit2, X } from 'lucide-react';

type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'tools'
  | 'leadership';

interface EditingSkill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number;
  icon: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<EditingSkill | null>(null);

  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'frontend' as SkillCategory,
    proficiency: 50,
    icon: '',
  });

  const supabase = createClient();
  const categories: SkillCategory[] = [
    'frontend',
    'backend',
    'devops',
    'tools',
    'leadership',
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category')
        .order('display_order');

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSkill.name.trim()) return;

    try {
      const { error } = await supabase.from('skills').insert([
        {
          name: newSkill.name,
          category: newSkill.category,
          proficiency: newSkill.proficiency,
          icon: newSkill.icon || null,
          display_order: skills.length,
        },
      ]);

      if (error) throw error;

      setNewSkill({
        name: '',
        category: 'frontend',
        proficiency: 50,
        icon: '',
      });

      fetchSkills();
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleEditSkill = async () => {
    if (!editingSkill) return;

    try {
      const { error } = await supabase
        .from('skills')
        .update({
          name: editingSkill.name,
          category: editingSkill.category,
          proficiency: editingSkill.proficiency,
          icon: editingSkill.icon || null,
        })
        .eq('id', editingSkill.id);

      if (error) throw error;

      setEditingId(null);
      setEditingSkill(null);
      fetchSkills();
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase.from('skills').delete().eq('id', deleteId);

      if (error) throw error;

      setSkills(skills.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading skills...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-gray-100">Skills</h1>

      {/* Add Skill Form */}
      <div className="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-100">
          Add New Skill
        </h2>
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="skillName"
                className="block text-sm font-medium text-gray-200"
              >
                Skill Name
              </label>
              <input
                id="skillName"
                type="text"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
                placeholder="e.g., React"
                className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-200"
              >
                Category
              </label>
              <select
                id="category"
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill({
                    ...newSkill,
                    category: e.target.value as SkillCategory,
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="proficiency"
                className="block text-sm font-medium text-gray-200"
              >
                Proficiency: {newSkill.proficiency}%
              </label>
              <input
                id="proficiency"
                type="range"
                min="0"
                max="100"
                value={newSkill.proficiency}
                onChange={(e) =>
                  setNewSkill({
                    ...newSkill,
                    proficiency: parseInt(e.target.value),
                  })
                }
                className="mt-1 w-full"
              />
            </div>

            <div>
              <label
                htmlFor="icon"
                className="block text-sm font-medium text-gray-200"
              >
                Icon (optional)
              </label>
              <input
                id="icon"
                type="text"
                value={newSkill.icon}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, icon: e.target.value })
                }
                placeholder="e.g., react"
                className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Skill
          </button>
        </form>
      </div>

      {/* Skills by Category */}
      <div className="space-y-8">
        {categories.map((category) => {
          const categorySkills = groupedSkills[category] || [];

          return (
            <div key={category}>
              <h2 className="mb-4 text-2xl font-semibold text-gray-100">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>

              {categorySkills.length === 0 ? (
                <p className="text-gray-400">No skills in this category yet</p>
              ) : (
                <div className="space-y-3">
                  {categorySkills.map((skill) =>
                    editingId === skill.id ? (
                      <div
                        key={skill.id}
                        className="rounded-lg border border-gray-600 bg-gray-700 p-4 space-y-3"
                      >
                        <div className="grid gap-3 md:grid-cols-3">
                          <input
                            type="text"
                            value={editingSkill?.name || ''}
                            onChange={(e) =>
                              setEditingSkill({
                                ...editingSkill!,
                                name: e.target.value,
                              })
                            }
                            className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editingSkill?.proficiency || 0}
                            onChange={(e) =>
                              setEditingSkill({
                                ...editingSkill!,
                                proficiency: parseInt(e.target.value),
                              })
                            }
                            className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100"
                          />
                          <input
                            type="text"
                            value={editingSkill?.icon || ''}
                            onChange={(e) =>
                              setEditingSkill({
                                ...editingSkill!,
                                icon: e.target.value,
                              })
                            }
                            placeholder="Icon"
                            className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleEditSkill}
                            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingSkill(null);
                            }}
                            className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={skill.id}
                        className="rounded-lg border border-gray-700 bg-gray-800 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <h3 className="font-medium text-gray-100">
                                {skill.name}
                              </h3>
                              {skill.icon && (
                                <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                                  {skill.icon}
                                </span>
                              )}
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-700">
                              <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${skill.proficiency}%` }}
                              ></div>
                            </div>
                            <p className="mt-1 text-sm text-gray-400">
                              {skill.proficiency}%
                            </p>
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => {
                                setEditingId(skill.id);
                                setEditingSkill({
                                  id: skill.id,
                                  name: skill.name,
                                  category: skill.category as SkillCategory,
                                  proficiency: skill.proficiency,
                                  icon: skill.icon || '',
                                });
                              }}
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteId(skill.id)}
                              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <DeleteConfirmDialog
        title="Delete Skill"
        description="Are you sure you want to delete this skill? This action cannot be undone."
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
