"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath, getActiveSidebarClass } from "../../../lib/utils";

export default function RoleDetailLayoutClient({ children, roleId }: { children: React.ReactNode; roleId: string }) {
  const pathname = usePathname();
  const base = `/roles/${roleId}`;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4 hidden md:block">
        <nav className="space-y-2">
          <Link 
            href={`${base}/overview`} 
            className={getActiveSidebarClass(isActivePath(pathname, `${base}/overview`))}
          >
            Overview
          </Link>
          <Link 
            href={`${base}/issues`} 
            className={getActiveSidebarClass(isActivePath(pathname, `${base}/issues`))}
          >
            Issues
          </Link>
        </nav>
      </aside>
      <section className="flex-1">{children}</section>
    </div>
  );
} 