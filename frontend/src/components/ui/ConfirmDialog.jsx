import React from 'react';
import Modal from './Modal';
import { AlertCircle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  isDestructive = true,
  isLoading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded bg-rose-50 text-rose-600 flex-shrink-0">
          <AlertCircle className="w-4 h-4" />
        </div>
        <p className="text-xs text-zinc-600 leading-relaxed mt-0.5">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-md cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-3 py-1.5 text-xs font-medium text-white rounded-md transition-colors cursor-pointer disabled:opacity-50 ${
            isDestructive
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-zinc-900 hover:bg-zinc-800'
          }`}
        >
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
