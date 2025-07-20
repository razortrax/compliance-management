"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCompanyContext } from "../../components/CompanyProvider";
import { Truck } from "lucide-react";

export default function EquipmentPage() {
  const { selectedCompany } = useCompanyContext();
  const [equipment, setEquipment] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedCompany) {
      const fetchEquipment = async () => {
        try {
          const res = await fetch('/api/equipment');
          const data = await res.json();
          // This filtering should be done on the backend in a real app
          setEquipment(data.filter((e: any) => e.roles.some((r: any) => r.organization?.id === selectedCompany.id || r.managedOrg?.id === selectedCompany.id)));
        } catch (error) {
          console.error("Failed to fetch equipment:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchEquipment();
    }
  }, [selectedCompany]);

  if (isLoading) {
    return <div>Loading equipment...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Truck className="w-6 h-6 mr-2" />
          Equipment
        </h1>
        <Link href="/equipment/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add New Equipment
        </Link>
      </div>
      <div className="bg-white rounded shadow">
        <ul className="divide-y divide-gray-200">
          {equipment.map((item) => (
            <li key={item.id}>
              <Link href={`/equipment/${item.id}/overview`} className="block p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.year} {item.make} {item.model}</p>
                    <p className="text-sm text-gray-500">Unit #: {item.unitNumber} | VIN: {item.vin}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.status}
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