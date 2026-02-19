'use client';

import { useState } from 'react';

interface DeleteConfirmDialogProps {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

export default function DeleteConfirmDialog({
  title,
  description,
  onConfirm,
  onCancel,
  isOpen,
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="rounded-lg border border-gray-600 bg-gray-800 p-6 shadow-lg max-w-sm w-full mx-4">
        <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
        <p className="mt-2 text-gray-300">{description}</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 font-medium text-gray-100 hover:bg-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
