"use client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4 hidden md:block">
        {/* DashboardSidebar goes here */}
        <div className="font-semibold">Sidebar</div>
      </aside>
      <section className="flex-1">{children}</section>
    </div>
  );
} 