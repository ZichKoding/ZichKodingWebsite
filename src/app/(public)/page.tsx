import { Metadata } from 'next';
import { HomePage } from '@/components/home/HomePage';

export const metadata: Metadata = {
  title: 'Chris Zichko - Developer & Technology Manager | AI Systems Builder',
  description:
    "Explore Chris Zichko's portfolio through an interactive space-themed terminal: production PHP systems by day, local-first AI agents in Rust and Kotlin by night, freelance via ZichKoding.",
  keywords: [
    'software engineer',
    'AI engineering',
    'local LLMs',
    'Rust',
    'full-stack developer',
    'portfolio',
    'Next.js',
    'TypeScript',
  ],
};

export default function HomePageRoute() {
  return <HomePage />;
}
