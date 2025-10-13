'use client';

import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        tabIndex={0}
        className="bg-white rounded-lg shadow-xl p-6 pt-0 z-50 flex flex-col relative max-w-md w-full max-h-9/10"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
          }
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl font-bold text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold border-b border-gray-300 py-4 flex-none">
          {title}
        </h2>

        <div className="max-h-full overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
