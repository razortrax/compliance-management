"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelectorContext } from "../../../components/SelectorProvider";
import { use } from "react";
import { useCompanyContext } from "../../../components/CompanyProvider";
import SelectorButton from "../../../components/SelectorButton";
import { isActivePath, getActiveSidebarClass } from "../../../lib/utils";

export default function LocationLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ locationId: string }>;
}) {
  const pathname = usePathname();
  const { locationId } = use(params);
  const { showSelector, handleOpen, drivers, equipment } = useSelectorContext();
  const { canViewLocation } = useCompanyContext();

  const hasDriversOrEquipment = drivers.length > 0 || equipment.length > 0;

  // Check if user can view this location
  if (!canViewLocation(locationId)) {
    return (
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h1>
            <p className="text-red-700">
              You don&apos;t have permission to view this location.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 hidden md:block">
        {/* Selector buttons positioned between navbar and sidebar */}
        {showSelector && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-2">
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
              href={`/locations/${locationId}`} 
              className={getActiveSidebarClass(isActivePath(pathname, `/locations/${locationId}`))}
            >
              Overview
            </Link>
            <Link 
              href={`/locations/${locationId}/accidents`} 
              className={getActiveSidebarClass(isActivePath(pathname, `/locations/${locationId}/accidents`))}
            >
              Accidents
            </Link>
            <Link 
              href={`/locations/${locationId}/inspections`} 
              className={getActiveSidebarClass(isActivePath(pathname, `/locations/${locationId}/inspections`))}
            >
              Inspections
            </Link>
          </nav>
        </div>
      </aside>
      <section className="flex-1">{children}</section>
    </div>
  );
} 