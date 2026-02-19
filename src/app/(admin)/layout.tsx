import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <AdminSidebar userEmail={user.email} />
      <main className="flex-1 overflow-auto bg-gray-900">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
