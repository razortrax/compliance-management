"use client";
import { useState, useEffect } from "react";

export default function DriverDocumentsPage({ params }: any) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`/api/persons/${params.driverId}/documents`);
        const data = await res.json();
        setDocuments(data);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [params.driverId]);

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Driver Documents</h1>
      {/* Render documents here */}
    </div>
  );
} 