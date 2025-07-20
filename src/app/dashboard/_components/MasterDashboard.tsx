"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCompanyContext } from "@/components/CompanyProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import Button from "@/ui/Button";
import Link from "next/link";

export default function MasterDashboard() {
  const { availableCompanies, setCurrentCompanyId } = useCompanyContext();
  const [companyIssues, setCompanyIssues] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAllIssues = async () => {
      if (availableCompanies.length === 0) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const issuesByCompany: any = {};
        const promises = availableCompanies.map(async (company) => {
          if (!company || !company.id) return;
          const res = await fetch(`/api/issues?companyId=${company.id}`);
          if (res.ok) {
            const issues = await res.json();
            issuesByCompany[company.id] = issues;
          } else {
            issuesByCompany[company.id] = [];
          }
        });

        await Promise.all(promises);
        setCompanyIssues(issuesByCompany);

      } catch (error) {
        console.error("Failed to fetch issues for all companies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllIssues();
  }, [availableCompanies]);

  const getIssueSummary = (companyId: string) => {
    const issues = companyIssues[companyId] || [];
    const expiringSoon = issues.filter((issue: any) => issue.status === 'DUE_30' || issue.status === 'DUE_60').length;
    const expired = issues.filter((issue: any) => issue.status === 'EXPIRED').length;
    const openWorkflows = issues.filter((issue: any) => issue.correctiveActions?.some((ca: any) => !ca.dateCompleted)).length;

    return { expiringSoon, expired, openWorkflows };
  };

  const handleCompanySelect = (companyId: string) => {
    setCurrentCompanyId(companyId);
    router.push("/organization/overview");
  };

  if (isLoading) {
    return <div>Loading master dashboard...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Master Dashboard</h1>
        <Link href="/organization/new" passHref>
          <Button>+ New Company</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableCompanies.map((company) => {
          if (!company) return null;
          const summary = getIssueSummary(company.id);
          return (
            <Card 
              key={company.id} 
              onClick={() => handleCompanySelect(company.id)}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Expiring Soon:</strong> <span className="font-semibold text-orange-500">{summary.expiringSoon}</span></p>
                  <p><strong>Expired:</strong> <span className="font-semibold text-red-500">{summary.expired}</span></p>
                  <p><strong>Open Workflows:</strong> <span className="font-semibold">{summary.openWorkflows}</span></p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 