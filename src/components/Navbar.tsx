"use client";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="font-bold">Compliance App</div>
      <div className="space-x-4">
        <a href="/dashboard" className="hover:underline">Dashboard</a>
        <a href="/blog" className="hover:underline">Blog</a>
      </div>
    </nav>
  );
} 