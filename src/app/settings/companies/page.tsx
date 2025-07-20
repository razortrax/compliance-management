"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCompanyContext } from "../../../components/CompanyProvider";
import { Building2 } from "lucide-react";

export default function CompaniesPage() {
  const { selectedCompany } = useCompanyContext();
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedCompany) {
      const fetchCompanies = async () => {
        try {
          // In a real app, you would have a dedicated endpoint to get sub-companies
          const res = await fetch('/api/organizations');
          const data = await res.json();
          setCompanies(data.filter((org: any) => org.type === 'SUB_ORGANIZATION' && org.managingOrg?.id === selectedCompany.id));
        } catch (error) {
          console.error("Failed to fetch companies:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCompanies();
    }
  }, [selectedCompany]);

  if (isLoading) {
    return <div>Loading companies...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Building2 className="w-6 h-6 mr-2" />
          Sub-Companies
        </h1>
        <Link href="/settings/companies/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add New Company
        </Link>
      </div>
      <div className="bg-white rounded shadow">
        <ul className="divide-y divide-gray-200">
          {companies.map((company) => (
            <li key={company.id}>
              <Link href={`/organization/${company.id}/overview`} className="block p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{company.name}</p>
                    <p className="text-sm text-gray-500">{company.address}, {company.city}, {company.state} {company.zip}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${company.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {company.status}
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