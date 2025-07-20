"use client";
import { useEffect, useState } from "react";
import { Truck } from 'lucide-react';

export default function EquipmentOverviewPage({ params }: any) {
  const [equipment, setEquipment] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipmentRes, issuesRes] = await Promise.all([
          fetch(`/api/equipment/${params.equipmentId}`),
          fetch(`/api/issues?equipmentId=${params.equipmentId}`)
        ]);
        const equipmentData = await equipmentRes.json();
        const issuesData = await issuesRes.json();
        setEquipment(equipmentData);
        setIssues(issuesData);
      } catch (error) {
        console.error("Failed to fetch equipment data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.equipmentId]);

  if (isLoading) {
    return <div>Loading equipment overview...</div>;
  }

  if (!equipment) {
    return <div>Equipment not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{equipment.name} - Overview</h1>
      {/* Overview content */}
    </div>
  );
} 