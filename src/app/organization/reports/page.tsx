"use client";
import EntityIcon from "../../../components/EntityIcon";

export default function OrganizationReportsPage() {
  return (
    <main className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <EntityIcon type="organization" className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>
      <div className="bg-white rounded shadow p-4">Reports and analytics go here.</div>
    </main>
  );
} 