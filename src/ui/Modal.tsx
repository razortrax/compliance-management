"use client";

export default function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded shadow p-6 relative min-w-[300px]">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">&times;</button>
        {children}
      </div>
    </div>
  );
} 