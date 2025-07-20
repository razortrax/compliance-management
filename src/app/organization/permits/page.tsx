"use client";
import EntityIcon from "../../../components/EntityIcon";

export default function OrganizationPermitsPage() {
  return (
    <main className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <EntityIcon type="organization" className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold">Permits</h1>
      </div>
      <div className="bg-white rounded shadow p-4">Permits and insurance records go here.</div>
    </main>
  );
} 