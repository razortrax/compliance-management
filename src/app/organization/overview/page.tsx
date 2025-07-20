"use client";
import { useState, useEffect } from "react";
import { useCompanyContext } from "../../../components/CompanyProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import Button from "@/ui/Button";
import Link from "next/link";
// Temporarily disabled recharts to fix build issues
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function OrganizationOverview() {
  const { selectedCompany } = useCompanyContext();
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedCompany) {
      const fetchIssues = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/issues?companyId=${selectedCompany.id}`);
          const data = await res.json();
          setIssues(data);
        } catch (error) {
          console.error("Failed to fetch issues:", error);
          setIssues([]); // Reset issues on error
        } finally {
          setIsLoading(false);
        }
      };
      fetchIssues();
    } else {
      // Handles the initial state where no company is selected yet
      setIsLoading(false); 
      setIssues([]);
    }
  }, [selectedCompany]);

  if (isLoading) {
    return <div style={{padding: '24px'}}>Loading overview...</div>;
  }

  if (!selectedCompany) {
    return <div style={{padding: '24px'}}>No company selected.</div>;
  }

  const issueStats = {
    ok: issues.filter(i => i.status === 'OK').length,
    dueSoon: issues.filter(i => i.status === 'DUE_60' || i.status === 'DUE_30').length,
    expired: issues.filter(i => i.status === 'EXPIRED').length,
  };

  return (
    <div style={{padding: '24px'}}>
      <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px'}}>
        {selectedCompany.name} - Overview
      </h1>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
        
        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{textAlign: 'center', color: '#6b7280', paddingTop: '64px'}}>
              Compliance data coming soon.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue Status</CardTitle>
          </CardHeader>
          <CardContent>
            {issues.length > 0 ? (
              <div style={{padding: '20px'}}>
                <div style={{marginBottom: '16px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#22c55e', color: 'white', borderRadius: '4px', marginBottom: '8px'}}>
                    <span>OK Issues</span>
                    <span style={{fontWeight: 'bold'}}>{issueStats.ok}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f59e0b', color: 'white', borderRadius: '4px', marginBottom: '8px'}}>
                    <span>Due Soon</span>
                    <span style={{fontWeight: 'bold'}}>{issueStats.dueSoon}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#ef4444', color: 'white', borderRadius: '4px'}}>
                    <span>Expired</span>
                    <span style={{fontWeight: 'bold'}}>{issueStats.expired}</span>
                  </div>
                </div>
                <p style={{fontSize: '0.875rem', color: '#6b7280', textAlign: 'center'}}>
                  Chart visualization coming soon
                </p>
              </div>
            ) : (
              <div style={{textAlign: 'center', color: '#6b7280', paddingTop: '64px'}}>
                No issues found for this company.
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <Button asChild><Link href="/organization/inspections">View Inspections</Link></Button>
            <Button asChild><Link href="/organization/accidents">View Accidents</Link></Button>
            <Button asChild><Link href="/drivers">Manage Drivers</Link></Button>
            <Button asChild><Link href="/equipment">Manage Equipment</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 