"use client";
import { useState, useEffect } from "react";
import IssueMasterDetail from "../../../../components/IssueMasterDetail";

export default function TrainingPage({ params }: any) {
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`/api/issues?personId=${params.driverId}&type=TRAINING`);
        const data = await res.json();
        setIssues(data);
      } catch (error) {
        console.error("Failed to fetch training issues:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, [params.driverId]);

  if (isLoading) {
    return <div>Loading training records...</div>;
  }

  return (
    <IssueMasterDetail
      title="Training"
      issues={issues}
      violations={[]} // You would fetch these from an API
    />
  );
} 