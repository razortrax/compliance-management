"use client";
import React from 'react';

interface SelectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: any) => void;
  title: string;
  items: any[];
}

export default function SelectorDrawer({
  isOpen,
  onClose,
  title,
  items,
  onSelect,
}: SelectorDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      <div
        className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg p-6 z-50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <ul>
          {items && items.length > 0 ? (
            items.map((item) => (
              <li
                key={item.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelect(item)}
              >
                {item.name || `Item ${item.id}`}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No items to select.</li>
          )}
        </ul>
      </div>
    </div>
  );
} 