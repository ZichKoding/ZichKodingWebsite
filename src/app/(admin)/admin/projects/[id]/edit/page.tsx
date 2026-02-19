'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import slugify from 'slugify';
import { createClient } from '@/lib/supabase/client';
import { Project } from '@/lib/supabase/types';
import { Plus, X } from 'lucide-react';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const slug = slugify(title, { lower: true, strict: true });

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      setProject(data);
      setTitle(data.title);
      setDescription(data.description);
      setTechStack(data.tech_stack || []);
      setLiveUrl(data.live_url || '');
      setGithubUrl(data.github_url || '');
      setImageUrl(data.image_url || '');
      setFeatured(data.featured);
      setDisplayOrder(data.display_order);
    } catch (error) {
      console.error('Error fetching project:', error);
      router.push('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          title,
          slug,
          description,
          tech_stack: techStack,
          live_url: liveUrl || null,
          github_url: githubUrl || null,
          image_url: imageUrl || null,
          featured,
          display_order: displayOrder,
        })
        .eq('id', projectId);

      if (updateError) throw updateError;

      router.push('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Project not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-100">Edit Project</h1>
        <p className="mt-2 text-gray-400">Update your project details</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {error && (
          <div className="rounded-lg border border-red-600 bg-red-900 px-4 py-3 text-red-100">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
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
              placeholder="Project title"
              className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              required
            />
            {title && (
              <p className="mt-2 text-sm text-gray-400">Slug: {slug}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="displayOrder"
              className="block text-sm font-medium text-gray-200"
            >
              Display Order
            </label>
            <input
              id="displayOrder"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-200"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project description"
            rows={4}
            className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-200"
          >
            Image URL
          </label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="techInput"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Tech Stack (press Enter to add)
          </label>
          <input
            id="techInput"
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={handleAddTech}
            placeholder="e.g., React, Node.js, PostgreSQL"
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
          {techStack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <div
                  key={tech}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-900 px-3 py-1"
                >
                  <span className="text-sm font-medium text-blue-200">
                    {tech}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="text-blue-300 hover:text-blue-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="liveUrl"
              className="block text-sm font-medium text-gray-200"
            >
              Live URL
            </label>
            <input
              id="liveUrl"
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://project.com"
              className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="githubUrl"
              className="block text-sm font-medium text-gray-200"
            >
              GitHub URL
            </label>
            <input
              id="githubUrl"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-gray-600 bg-gray-700 p-4">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600"
          />
          <label htmlFor="featured" className="text-gray-200">
            Featured project
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Update Project'}
        </button>
      </form>
    </div>
  );
}
