import Link from "next/link";

export default function RolesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4 hidden md:block">
        <nav className="space-y-2">
          <Link href="/roles" className="block p-2 rounded hover:bg-gray-200">Role Explorer</Link>
        </nav>
      </aside>
      <section className="flex-1">{children}</section>
    </div>
  );
} 