"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelectorContext } from "../../components/SelectorProvider";
import { useCompanyContext } from "../../components/CompanyProvider";
import SelectorButton from "../../components/SelectorButton";
import CompanySelectorButton from "../../components/CompanySelectorButton";
import { isActivePath, getActiveSidebarClass } from "../../lib/utils";

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { showSelector, handleOpen, drivers, equipment } = useSelectorContext();
  const { showCompanySelector, handleCompanySelectorOpen } = useCompanyContext();

  const hasDriversOrEquipment = drivers.length > 0 || equipment.length > 0;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 hidden md:block">
        {/* Selector buttons positioned between navbar and sidebar */}
        {showSelector && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-2">
              {/* Company Selector Button (smaller) - only for master users */}
              {showCompanySelector && (
                <div className="flex-shrink-0">
                  <CompanySelectorButton
                    onClick={handleCompanySelectorOpen}
                    className="w-12 h-12 px-2"
                  />
                </div>
              )}
              
              {/* Driver/Equipment Selector Button */}
              {hasDriversOrEquipment && (
                <div className="flex-1">
                  <SelectorButton onClick={handleOpen} />
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Sidebar navigation */}
        <div className="p-4">
          <nav className="space-y-2">
            <Link 
              href="/organization/overview" 
              className={getActiveSidebarClass(isActivePath(pathname, "/organization/overview"))}
            >
              Overview
            </Link>
            <Link 
              href="/organization/accidents" 
              className={getActiveSidebarClass(isActivePath(pathname, "/organization/accidents"))}
            >
              Accidents
            </Link>
            <Link 
              href="/organization/inspections" 
              className={getActiveSidebarClass(isActivePath(pathname, "/organization/inspections"))}
            >
              Inspections
            </Link>
            <Link 
              href="/organization/audit" 
              className={getActiveSidebarClass(isActivePath(pathname, "/organization/audit"))}
            >
              Audit
            </Link>
            <Link 
              href="/organization/permits" 
              className={getActiveSidebarClass(isActivePath(pathname, "/organization/permits"))}
            >
              Permits
            </Link>
            <Link 
              href="/organization/reports" 
              className={getActiveSidebarClass(isActivePath(pathname, "/organization/reports"))}
            >
              Reports
            </Link>
          </nav>
        </div>
      </aside>
      <section className="flex-1">{children}</section>
    </div>
  );
} 