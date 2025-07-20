"use client";
import { useState, useEffect } from "react";
import IssueMasterDetail from "../../../../components/IssueMasterDetail";

export default function AnnualInspectionsPage({ params }: any) {
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`/api/issues?equipmentId=${params.equipmentId}&type=ANNUAL_INSPECTION`);
        const data = await res.json();
        setIssues(data);
      } catch (error) {
        console.error("Failed to fetch annual inspection issues:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, [params.equipmentId]);

  if (isLoading) {
    return <div>Loading annual inspection records...</div>;
  }

  return (
    <IssueMasterDetail
      title="Annual Inspections"
      issues={issues}
      violations={[]} // You would fetch these from an API
    />
  );
} 