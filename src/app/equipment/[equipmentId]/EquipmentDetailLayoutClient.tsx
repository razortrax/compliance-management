"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelectorContext } from "../../../components/SelectorProvider";
import { useCompanyContext } from "../../../components/CompanyProvider";
import SelectorButton from "../../../components/SelectorButton";
import CompanySelectorButton from "../../../components/CompanySelectorButton";
import { isActivePath, getActiveSidebarClass } from "../../../lib/utils";

export default function EquipmentDetailLayoutClient({ children, equipmentId }: { children: React.ReactNode; equipmentId: string }) {
  const pathname = usePathname();
  const base = `/equipment/${equipmentId}`;
  const { isOpen, handleOpen, handleClose, showSelector, drivers, equipment } = useSelectorContext();
  const { showCompanySelector, handleCompanySelectorOpen, currentCompanyId } = useCompanyContext();

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
              href={`${base}/overview`} 
              className={getActiveSidebarClass(isActivePath(pathname, `${base}/overview`))}
            >
              Overview
            </Link>
            <Link 
              href={`${base}/registration`} 
              className={getActiveSidebarClass(isActivePath(pathname, `${base}/registration`))}
            >
              Registration
            </Link>
            <Link 
              href={`${base}/annual-inspections`} 
              className={getActiveSidebarClass(isActivePath(pathname, `${base}/annual-inspections`))}
            >
              Annual Inspections
            </Link>
            <Link 
              href={`${base}/roadside-inspections`} 
              className={getActiveSidebarClass(isActivePath(pathname, `${base}/roadside-inspections`))}
            >
              Roadside Inspections
            </Link>
            <Link 
              href={`${base}/maintenance`} 
              className={getActiveSidebarClass(isActivePath(pathname, `${base}/maintenance`))}
            >
              Maintenance
            </Link>
            <Link 
              href={`${base}/accidents`} 
              className={getActiveSidebarClass(isActivePath(pathname, `${base}/accidents`))}
            >
              Accidents
            </Link>
            <Link 
              href={`${base}/documents`} 
              className={getActiveSidebarClass(isActivePath(pathname, `${base}/documents`))}
            >
              Documents
            </Link>
          </nav>
        </div>
      </aside>
      <section className="flex-1">{children}</section>
    </div>
  );
} 