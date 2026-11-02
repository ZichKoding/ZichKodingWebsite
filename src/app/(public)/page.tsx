import { Metadata } from 'next';
import { HomePage } from '@/components/home/HomePage';

export const metadata: Metadata = {
  title: 'Chris Zichko - Lead Developer & Technology Manager',
  description:
    'Lead Developer and Technology Manager. Traditional software, AI engineering, and small open models on the device, driven by Gemma 4 E4B.',
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
