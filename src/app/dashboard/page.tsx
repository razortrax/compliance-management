"use client";
import { useCompanyContext } from "@/components/CompanyProvider";
import MasterDashboard from "./_components/MasterDashboard";
import SingleCompanyDashboard from "./_components/SingleCompanyDashboard";

export default function DashboardPage() {
  const { isMasterUser, isLoading } = useCompanyContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isMasterUser ? <MasterDashboard /> : <SingleCompanyDashboard />;
} 