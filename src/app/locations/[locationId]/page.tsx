"use client";
import { useEffect, useState } from "react";

export default function LocationOverviewPage({ params }: any) {
  const [location, setLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`/api/organizations/${params.locationId}`);
        const data = await res.json();
        setLocation(data);
      } catch (error) {
        console.error("Failed to fetch location data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocation();
  }, [params.locationId]);

  if (isLoading) {
    return <div>Loading location overview...</div>;
  }

  if (!location) {
    return <div>Location not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{location.name} - Overview</h1>
      {/* Overview content */}
    </div>
  );
} 