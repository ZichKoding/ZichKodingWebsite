import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';
import { generateGradient } from '@/lib/utils';

interface ProjectCardProps {
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  featured?: boolean;
}

export function ProjectCard({
  title,
  description,
  tech_stack,
  image_url,
  live_url,
  github_url,
  featured = false,
}: ProjectCardProps) {
  const gradientClasses = generateGradient(title);

  return (
    <div
      className={`group rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 ${
        featured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative ${featured ? 'h-64' : 'h-48'} overflow-hidden bg-gradient-to-br ${gradientClasses} group-hover:scale-105 transition-transform duration-300`}>
        {image_url ? (
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/20 text-center px-4">{title}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Tech Stack */}
        {tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tech_stack.map((tech) => (
              <span
                key={tech}
                className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
          {live_url && (
            <a
              href={live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
              aria-label="Visit live site"
            >
              <span>Live</span>
              <ExternalLink size={16} />
            </a>
          )}

          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
              aria-label="View on GitHub"
            >
              <span>Code</span>
              <Github size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
