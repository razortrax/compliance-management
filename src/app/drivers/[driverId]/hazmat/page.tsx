"use client";
import { useState, useEffect } from "react";
import IssueMasterDetail from "../../../../components/IssueMasterDetail";

export default function HazmatPage({ params }: any) {
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`/api/issues?personId=${params.driverId}&type=HAZMAT`);
        const data = await res.json();
        setIssues(data);
      } catch (error) {
        console.error("Failed to fetch hazmat issues:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, [params.driverId]);

  if (isLoading) {
    return <div>Loading Hazmat records...</div>;
  }

  return (
    <IssueMasterDetail
      title="Hazmat"
      issues={issues}
      violations={[]} // You would fetch these from an API
    />
  );
} 