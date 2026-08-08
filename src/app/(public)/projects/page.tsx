import { Metadata } from 'next';
import { PROJECTS } from '@/data/projects';
import { ProjectCard } from '@/components/public/ProjectCard';

export const metadata: Metadata = {
  title: 'Projects - Chris Zichko | ZichKoding',
  description:
    'Real projects: a Rust terminal AI agent, an offline Android AI companion, persistent-memory tooling, and production compliance-platform work.',
};

export default function ProjectsPage() {
  const projects = [...PROJECTS].sort((a, b) => a.display_order - b.display_order);
  const featuredProjects = projects.filter((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);

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
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  tech_stack={project.tech_stack}
                  image_url={project.image_url ?? null}
                  live_url={project.live_url ?? null}
                  github_url={project.github_url ?? null}
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
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  tech_stack={project.tech_stack}
                  image_url={project.image_url ?? null}
                  live_url={project.live_url ?? null}
                  github_url={project.github_url ?? null}
                  featured={false}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
