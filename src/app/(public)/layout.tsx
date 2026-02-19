import type { Metadata } from 'next';
import { Navbar } from '@/components/public/Navbar';
import { ConditionalFooter } from '@/components/public/ConditionalFooter';
import { PublicLayoutClient } from '@/components/public/PublicLayoutClient';

export const metadata: Metadata = {
  title: 'Chris | ZichKoding - Portfolio',
  description: 'Full-stack developer portfolio showcasing projects and blog posts',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayoutClient>
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
