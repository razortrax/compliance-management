"use client";
import { useState, useEffect } from "react";

export default function EquipmentDocumentsPage({ params }: any) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`/api/equipment/${params.equipmentId}/documents`);
        const data = await res.json();
        setDocuments(data);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [params.equipmentId]);

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Equipment Documents</h1>
      {/* Render documents here */}
    </div>
  );
} 