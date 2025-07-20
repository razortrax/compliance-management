"use client";
import { useState, useEffect } from "react";
import ViolationSelector from "../../../components/ViolationSelector";

export default function ViolationsPage() {
  const [violations, setViolations] = useState<any[]>([]);
  const [selectedViolations, setSelectedViolations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const res = await fetch('/api/violations'); // Assuming a violations endpoint
        const data = await res.json();
        setViolations(data);
      } catch (error) {
        console.error("Failed to fetch violations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchViolations();
  }, []);

  const handleViolationsChange = (updatedViolations: any[]) => {
    setSelectedViolations(updatedViolations);
  };

  if (isLoading) {
    return <div>Loading violations...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Violation Selector Demo</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <ViolationSelector
          violations={violations}
          selectedViolations={selectedViolations}
          onViolationsChange={handleViolationsChange}
          equipment={[]}
        />
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Selected Violations:</h2>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(selectedViolations, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 