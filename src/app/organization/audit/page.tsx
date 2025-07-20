"use client";
import EntityIcon from "../../../components/EntityIcon";

export default function OrganizationAuditPage() {
  return (
    <main className="h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <EntityIcon type="organization" className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Audit</h1>
        </div>
        <p className="text-gray-600">Organization-wide compliance audit and issue tracking.</p>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-700">
            This page is under construction. A comprehensive audit view of all compliance issues will be available here soon.
          </p>
        </div>
      </div>
    </main>
  );
} 