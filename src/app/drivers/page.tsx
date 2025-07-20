"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCompanyContext } from "../../components/CompanyProvider";
import { User } from "lucide-react";

export default function DriversPage() {
  const { selectedCompany } = useCompanyContext();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedCompany) {
      const fetchDrivers = async () => {
        try {
          const res = await fetch('/api/persons'); // Assuming an endpoint for persons
          const data = await res.json();
          // This filtering should be done on the backend in a real app
          setDrivers(data.filter((p: any) => p.roles.some((r: any) => r.roleType === 'DRIVER' && (r.organization?.id === selectedCompany.id || r.managedOrg?.id === selectedCompany.id))));
        } catch (error) {
          console.error("Failed to fetch drivers:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDrivers();
    }
  }, [selectedCompany]);

  if (isLoading) {
    return <div>Loading drivers...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <User className="w-6 h-6 mr-2" />
          Drivers
        </h1>
        <Link href="/drivers/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add New Driver
        </Link>
      </div>
      <div className="bg-white rounded shadow">
        <ul className="divide-y divide-gray-200">
          {drivers.map((driver) => (
            <li key={driver.id}>
              <Link href={`/drivers/${driver.id}/overview`} className="block p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{driver.firstName} {driver.lastName}</p>
                    <p className="text-sm text-gray-500">{driver.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${driver.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {driver.status}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 