"use client";
import { useState, useEffect } from "react";
import IssueMasterDetail from "../../../../components/IssueMasterDetail";

export default function RoadsideInspectionsPage({ params }: any) {
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`/api/issues?equipmentId=${params.equipmentId}&type=ROADSIDE_INSPECTION`);
        const data = await res.json();
        setIssues(data);
      } catch (error) {
        console.error("Failed to fetch roadside inspection issues:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, [params.equipmentId]);

  if (isLoading) {
    return <div>Loading roadside inspection records...</div>;
  }

  return (
    <IssueMasterDetail
      title="Roadside Inspections"
      issues={issues}
      violations={[]} // You would fetch these from an API
    />
  );
} 