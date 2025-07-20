"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCompanyContext } from "../../components/CompanyProvider";
import { MapPin } from "lucide-react";

export default function LocationsPage() {
  const { selectedCompany } = useCompanyContext();
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedCompany) {
      const fetchLocations = async () => {
        try {
          // In a real app, you would have a dedicated endpoint to get locations for a company
          const res = await fetch('/api/organizations');
          const data = await res.json();
          setLocations(data.filter((org: any) => org.type === 'LOCATION' && org.managingOrg?.id === selectedCompany.id));
        } catch (error) {
          console.error("Failed to fetch locations:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLocations();
    }
  }, [selectedCompany]);

  if (isLoading) {
    return <div>Loading locations...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <MapPin className="w-6 h-6 mr-2" />
          Locations
        </h1>
        <Link href="/locations/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add New Location
        </Link>
      </div>
      <div className="bg-white rounded shadow">
        <ul className="divide-y divide-gray-200">
          {locations.map((location) => (
            <li key={location.id}>
              <Link href={`/locations/${location.id}/overview`} className="block p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.address}, {location.city}, {location.state} {location.zip}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${location.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {location.status}
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