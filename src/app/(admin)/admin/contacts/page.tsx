'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ContactMessage } from '@/lib/supabase/types';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight } from 'lucide-react';

type ContactStatus = 'new' | 'read' | 'replied' | 'archived';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ContactStatus | 'all'>('all');
  const supabase = createClient();

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('contact_messages').select('*');

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading contacts...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-100">Contacts</h1>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Filter by Status
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as ContactStatus | 'all')}
          className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100"
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
            <p className="text-gray-400">No contacts found</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <Link
              key={contact.id}
              href={`/admin/contacts/${contact.id}`}
              className="block rounded-lg border border-gray-700 bg-gray-800 p-4 hover:bg-gray-750 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-100">
                      {contact.name}
                    </h3>
                    <StatusBadge status={contact.status} />
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{contact.email}</p>
                  <p className="font-medium text-gray-200 mb-1">
                    {contact.subject}
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {contact.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDistanceToNow(new Date(contact.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <ChevronRight className="text-gray-500 flex-shrink-0" size={20} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
