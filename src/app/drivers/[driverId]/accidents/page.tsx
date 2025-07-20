"use client";
import { useState, useEffect } from "react";
import IssueMasterDetail from "../../../../components/IssueMasterDetail";

export default function AccidentsPage({ params }: any) {
  const [accidentIssues, setAccidentIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccidentIssues = async () => {
      try {
        const res = await fetch(`/api/issues?personId=${params.driverId}&type=ACCIDENT`);
        const data = await res.json();
        setAccidentIssues(data);
      } catch (error) {
        console.error("Failed to fetch accident issues:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccidentIssues();
  }, [params.driverId]);

  if (isLoading) {
    return <div>Loading accident records...</div>;
  }

  return (
    <IssueMasterDetail
      title="Accidents"
      issues={accidentIssues}
      violations={[]} // You would fetch these from an API
    />
  );
} 