"use client";

export default function FormField({ label, ...props }: { label: string; [key: string]: any }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input className="border rounded px-3 py-2 w-full" {...props} />
    </div>
  );
} 