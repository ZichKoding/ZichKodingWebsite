interface StatusBadgeProps {
  status: 'new' | 'read' | 'replied' | 'archived' | 'published' | 'draft';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, { bg: string; text: string }> = {
    new: { bg: 'bg-blue-900', text: 'text-blue-200' },
    read: { bg: 'bg-yellow-900', text: 'text-yellow-200' },
    replied: { bg: 'bg-green-900', text: 'text-green-200' },
    archived: { bg: 'bg-gray-700', text: 'text-gray-200' },
    published: { bg: 'bg-green-900', text: 'text-green-200' },
    draft: { bg: 'bg-gray-700', text: 'text-gray-200' },
  };

  const style = styles[status] || styles.archived;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text}`}
    >
      {status}
    </span>
  );
}
