'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Briefcase,
  Mail,
  Zap,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { logout } from '@/app/login/actions';

interface AdminSidebarProps {
  userEmail?: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Posts',
      href: '/admin/posts',
      icon: FileText,
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: FolderOpen,
    },
    {
      label: 'Projects',
      href: '/admin/projects',
      icon: Briefcase,
    },
    {
      label: 'Skills',
      href: '/admin/skills',
      icon: Zap,
    },
    {
      label: 'Contacts',
      href: '/admin/contacts',
      icon: Mail,
    },
  ];

  return (
    <aside className="w-64 border-r border-gray-700 bg-gray-800">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-gray-700 p-6">
          <h1 className="text-xl font-bold text-gray-100">Portfolio Admin</h1>
          {userEmail && (
            <p className="mt-2 truncate text-sm text-gray-400">{userEmail}</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors"
          >
            <ExternalLink size={18} />
            View Site
          </a>
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
