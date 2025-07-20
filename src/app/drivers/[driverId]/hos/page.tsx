"use client";
import { useState, useEffect } from "react";
import IssueMasterDetail from "../../../../components/IssueMasterDetail";

export default function HosPage({ params }: any) {
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`/api/issues?personId=${params.driverId}&type=HOS`);
        const data = await res.json();
        setIssues(data);
      } catch (error) {
        console.error("Failed to fetch HOS issues:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, [params.driverId]);

  if (isLoading) {
    return <div>Loading HOS records...</div>;
  }

  return (
    <IssueMasterDetail
      title="HOS"
      issues={issues}
      violations={[]} // You would fetch these from an API
    />
  );
} 