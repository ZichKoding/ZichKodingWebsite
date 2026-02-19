'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Project } from '@/lib/supabase/types';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setProjects(projects.filter((project) => project.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading projects...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-100">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          New Project
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
            <p className="text-gray-400">No projects yet</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-gray-700 bg-gray-800 overflow-hidden hover:border-gray-600 transition-colors"
            >
              {project.image_url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="p-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-100">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <Star
                      size={16}
                      className="flex-shrink-0 text-yellow-400 fill-yellow-400"
                    />
                  )}
                </div>

                <p className="mb-3 text-sm text-gray-400">
                  {project.description}
                </p>

                {project.tech_stack.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-full bg-blue-900 px-2 py-1 text-xs font-medium text-blue-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    <Edit2 size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteConfirmDialog
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
