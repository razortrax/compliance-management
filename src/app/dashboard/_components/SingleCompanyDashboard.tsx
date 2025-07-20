"use client";
import { useState, useEffect } from "react";
import { useCompanyContext } from "@/components/CompanyProvider";
import DashboardChart from "./DashboardChart";

export default function SingleCompanyDashboard() {
  const { selectedCompany } = useCompanyContext();
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      if (!selectedCompany) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/issues?companyId=${selectedCompany.id}`);
        const data = await res.json();
        setIssues(data);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, [selectedCompany]);

  const getStatusCounts = (filteredIssues: any[]) => {
    return {
      ok: filteredIssues.filter(i => i.status === 'OK').length,
      due_60: filteredIssues.filter(i => i.status === 'DUE_60').length,
      due_30: filteredIssues.filter(i => i.status === 'DUE_30').length,
      expired: filteredIssues.filter(i => i.status === 'EXPIRED').length,
    };
  };

  const driverIssues = issues.filter(i => i.role?.roleType === 'DRIVER' || i.role?.roleType === 'OPERATOR');
  const equipmentIssues = issues.filter(i => i.role?.roleType === 'OWNER' || i.role?.roleType === 'ASSET');
  
  const driverStatusCounts = getStatusCounts(driverIssues);
  const equipmentStatusCounts = getStatusCounts(equipmentIssues);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{selectedCompany?.name} Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardChart title="Driver Compliance" data={driverStatusCounts} />
        <DashboardChart title="Equipment Compliance" data={equipmentStatusCounts} />
      </div>
    </div>
  );
} 