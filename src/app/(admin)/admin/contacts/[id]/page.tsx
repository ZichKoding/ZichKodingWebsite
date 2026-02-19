'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ContactMessage } from '@/lib/supabase/types';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Mail } from 'lucide-react';

type ContactStatus = 'new' | 'read' | 'replied' | 'archived';

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;
  const [contact, setContact] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState<ContactStatus>('new');
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchContact();
  }, [contactId]);

  const fetchContact = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', contactId)
        .single();

      if (error) throw error;
      setContact(data);
      setAdminNotes(data.admin_notes || '');
      setStatus(data.status as ContactStatus);
    } catch (error) {
      console.error('Error fetching contact:', error);
      router.push('/admin/contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!contact) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({
          admin_notes: adminNotes || null,
          status,
          replied_at: status === 'replied' ? new Date().toISOString() : null,
        })
        .eq('id', contactId);

      if (error) throw error;

      setContact({
        ...contact,
        admin_notes: adminNotes || null,
        status,
      });
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Contact not found</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Header */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-100">
                  {contact.name}
                </h1>
                <p className="text-gray-400">{contact.email}</p>
              </div>
              <StatusBadge status={contact.status} />
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <p>
                Received{' '}
                {formatDistanceToNow(new Date(contact.created_at), {
                  addSuffix: true,
                })}
              </p>
              {contact.replied_at && (
                <p>
                  Replied{' '}
                  {formatDistanceToNow(new Date(contact.replied_at), {
                    addSuffix: true,
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Subject and Message */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              {contact.subject}
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p className="whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <label className="mb-3 block text-sm font-medium text-gray-200">
              Admin Notes
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add private notes about this contact..."
              rows={5}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Reply Button */}
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            <Mail size={18} />
            Reply via Email
          </a>
        </div>

        {/* Sidebar */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 h-fit">
          <h3 className="mb-4 font-semibold text-gray-100">Status</h3>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ContactStatus)}
            className="mb-6 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100"
          >
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
