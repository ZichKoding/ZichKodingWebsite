import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalPosts },
    { count: totalDraftPosts },
    { count: totalContacts },
    { count: totalProjects },
    { count: totalCategories },
  ] = await Promise.all([
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true),
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', false),
    supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('projects')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('categories')
      .select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    {
      title: 'Published Posts',
      value: totalPosts || 0,
      color: 'bg-blue-500',
    },
    {
      title: 'Draft Posts',
      value: totalDraftPosts || 0,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Contacts',
      value: totalContacts || 0,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Projects',
      value: totalProjects || 0,
      color: 'bg-green-500',
    },
    {
      title: 'Categories',
      value: totalCategories || 0,
      color: 'bg-pink-500',
    },
  ];

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-gray-100">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg"
          >
            <div className={`mb-4 h-2 w-12 rounded-full ${stat.color}`}></div>
            <p className="text-sm text-gray-400">{stat.title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-100">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-100">
          Getting Started
        </h2>
        <ul className="space-y-2 text-gray-300">
          <li>• Create and manage blog posts with the rich text editor</li>
          <li>• Organize posts with categories</li>
          <li>• Manage your project portfolio</li>
          <li>• Track and respond to contact messages</li>
          <li>• Update your skills and proficiency levels</li>
        </ul>
      </div>
    </div>
  );
}
