import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProjectCard } from '@/components/public/ProjectCard';

export const metadata: Metadata = {
  title: 'Projects - Chris | ZichKoding',
  description: 'Explore my latest projects and work',
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  // Fetch projects ordered by display_order
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
  }

  // Separate featured and regular projects
  const featuredProjects = (projects || []).filter((p) => p.featured);
  const regularProjects = (projects || []).filter((p) => !p.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">
            A selection of my recent work and side projects
          </p>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  tech_stack={project.tech_stack}
                  image_url={project.image_url}
                  live_url={project.live_url}
                  github_url={project.github_url}
                  featured={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Regular Projects */}
        {regularProjects.length > 0 && (
          <section>
            <h2 className={`text-2xl font-bold text-white mb-6 ${featuredProjects.length > 0 ? 'pt-8 border-t border-slate-800' : ''}`}>
              {featuredProjects.length > 0 ? 'More Projects' : 'Projects'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  tech_stack={project.tech_stack}
                  image_url={project.image_url}
                  live_url={project.live_url}
                  github_url={project.github_url}
                  featured={false}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {projects && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No projects available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
