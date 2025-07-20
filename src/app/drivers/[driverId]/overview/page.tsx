"use client";
import { useEffect, useState } from "react";
import { User, FileText, HeartPulse, Truck } from 'lucide-react';

export default function DriverOverviewPage({ params }: any) {
  const [driver, setDriver] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driverRes, issuesRes] = await Promise.all([
          fetch(`/api/persons/${params.driverId}`),
          fetch(`/api/issues?personId=${params.driverId}`)
        ]);
        const driverData = await driverRes.json();
        const issuesData = await issuesRes.json();
        setDriver(driverData);
        setIssues(issuesData);
      } catch (error) {
        console.error("Failed to fetch driver data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.driverId]);

  if (isLoading) {
    return <div>Loading driver overview...</div>;
  }

  if (!driver) {
    return <div>Driver not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{driver.name} - Overview</h1>
      {/* Overview content */}
    </div>
  );
} 