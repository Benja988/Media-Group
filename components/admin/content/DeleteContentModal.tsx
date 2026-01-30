'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { ContentResponse } from '@/types/content.types';

interface DeleteContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  content: ContentResponse | null;
}

export default function DeleteContentModal({
  isOpen,
  onClose,
  onConfirm,
  content
}: DeleteContentModalProps) {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6">
            {/* Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
              Delete Content
            </h3>

            {/* Message */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete this content? This action cannot be undone.
              </p>

              {/* Content Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {content.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{content.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      content.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      content.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Created:</span>
                    <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-6">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  <strong>Warning:</strong> Deleting this content will also remove all associated engagements (likes, comments, shares).
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Content
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}