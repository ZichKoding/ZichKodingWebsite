import { Metadata } from 'next';
import { HomePage } from '@/components/home/HomePage';

export const metadata: Metadata = {
  title: 'Chris - Full-Stack Developer & Space Enthusiast',
  description:
    'Explore Chris\'s portfolio through an interactive space-themed terminal. Lead Developer & UCF-certified Full-Stack Web Developer passionate about building scalable software.',
  keywords: [
    'full-stack developer',
    'web development',
    'portfolio',
    'React',
    'Next.js',
    'TypeScript',
  ],
};

export default function HomePageRoute() {
  return <HomePage />;
}
