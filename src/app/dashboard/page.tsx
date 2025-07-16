"use client";

export default function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Compliance Score Card Placeholder */}
        <div className="bg-white rounded shadow p-4">Compliance Score Card</div>
        <div className="bg-white rounded shadow p-4">Upcoming Expirations</div>
        <div className="bg-white rounded shadow p-4">Accidents & Inspections Queue</div>
      </div>
      <div className="mt-8 bg-white rounded shadow p-4">Open Violations / Corrective Actions</div>
    </main>
  );
} 