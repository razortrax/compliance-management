import Link from "next/link";
import { useSelectorHandlers } from "../../../components/SelectorProvider";
import SelectorButton from "../../../components/SelectorButton";
import SelectorDrawer from "../../../components/SelectorDrawer";
import { useState } from "react";

// Client component wrapper for the interactive parts
function DriverDetailLayoutClient({ children, driverId }: { children: React.ReactNode; driverId: string }) {
  "use client";
  const base = `/drivers/${driverId}`;
  const { isOpen, handleOpen, handleClose, showSelector } = useSelectorHandlers();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 hidden md:block">
        {/* Selector button positioned between navbar and sidebar */}
        {showSelector && (
          <div className="p-4 border-b border-gray-200">
            <SelectorButton onClick={handleOpen} />
          </div>
        )}
        {/* Sidebar navigation */}
        <div className="p-4">
          <nav className="space-y-2">
            <Link href={`${base}/overview`} className="block p-2 rounded hover:bg-gray-200">Overview</Link>
            <Link href={`${base}/licensing`} className="block p-2 rounded hover:bg-gray-200">Licensing & Endorsements</Link>
            <Link href={`${base}/mvr`} className="block p-2 rounded hover:bg-gray-200">MVRs</Link>
            <Link href={`${base}/drug-alcohol`} className="block p-2 rounded hover:bg-gray-200">Drug & Alcohol</Link>
            <Link href={`${base}/physicals`} className="block p-2 rounded hover:bg-gray-200">Physicals</Link>
            <Link href={`${base}/training`} className="block p-2 rounded hover:bg-gray-200">Training</Link>
            <Link href={`${base}/accidents`} className="block p-2 rounded hover:bg-gray-200">Accidents</Link>
            <Link href={`${base}/inspections`} className="block p-2 rounded hover:bg-gray-200">Roadside Inspections</Link>
            <Link href={`${base}/documents`} className="block p-2 rounded hover:bg-gray-200">Documents</Link>
          </nav>
        </div>
      </aside>
      <section className="flex-1">{children}</section>
      <SelectorDrawer 
        isOpen={isOpen} 
        onClose={handleClose} 
        onSelect={setSelectedItem}
        title="Select Driver"
        items={[]}
      />
    </div>
  );
}

export default async function DriverDetailLayout({ children, params }: { children: React.ReactNode; params: Promise<{ driverId: string }> }) {
  const { driverId } = await params;
  
  return <DriverDetailLayoutClient driverId={driverId}>{children}</DriverDetailLayoutClient>;
} 