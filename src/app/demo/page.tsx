"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function DemoPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (isLoading) {
    return <div>Loading demo users...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Demo Login</h1>
      <p className="mb-4">Select a user to simulate logging in:</p>
      <div className="space-y-2">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/dashboard?userId=${user.id}`} // Example of how you might log in
            className="block p-4 border rounded hover:bg-gray-100"
          >
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email} - ({user.role})</p>
          </Link>
        ))}
      </div>
    </div>
  );
} 