import type { Metadata } from 'next';
import { Navbar } from '@/components/public/Navbar';
import { ConditionalFooter } from '@/components/public/ConditionalFooter';
import { PublicLayoutClient } from '@/components/public/PublicLayoutClient';
import { getAllPosts } from '@/lib/content/blog';

export const metadata: Metadata = {
  title: 'Chris Zichko | ZichKoding — Portfolio',
  description:
    'Portfolio of Chris Zichko: production systems owner and builder of local-first AI tools — Rust agent harnesses, on-device Android AI, and persistent-memory systems.',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side read of the MDX content; the terminal `blog` command and the
  // home blog section both consume this, so they can never drift from /blog.
  const recentPosts = getAllPosts()
    .slice(0, 3)
    .map(({ slug, title, date }) => ({ slug, title, date }));

  return (
    <PublicLayoutClient recentPosts={recentPosts}>
      <div className="flex flex-col min-h-screen bg-slate-950">
        {/* Starfield background effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <ConditionalFooter />
        </div>
      </div>
    </PublicLayoutClient>
  );
}
