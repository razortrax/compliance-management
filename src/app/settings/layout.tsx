"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompanyContext } from "../../components/CompanyProvider";
import { isActivePath, getActiveSidebarClass } from "../../lib/utils";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMasterUser } = useCompanyContext();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4 hidden md:block">
        <nav className="space-y-2">
          <Link 
            href="/settings/users" 
            className={getActiveSidebarClass(isActivePath(pathname, "/settings/users"))}
          >
            Users
          </Link>
          {isMasterUser && (
            <Link 
              href="/settings/companies" 
              className={getActiveSidebarClass(isActivePath(pathname, "/settings/companies"))}
            >
              Companies
            </Link>
          )}
          <Link 
            href="/settings/notifications" 
            className={getActiveSidebarClass(isActivePath(pathname, "/settings/notifications"))}
          >
            Notifications
          </Link>
          <Link 
            href="/settings/import-export" 
            className={getActiveSidebarClass(isActivePath(pathname, "/settings/import-export"))}
          >
            Import/Export
          </Link>
        </nav>
      </aside>
      <section className="flex-1">{children}</section>
    </div>
  );
} 