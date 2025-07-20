"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanyContext } from "@/components/CompanyProvider";
import Button from "@/ui/Button";

export default function NewOrganizationPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    dotNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, refreshData } = useCompanyContext();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to create a company.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/organizations/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          managingOrgId: currentUser.companyId,
        }),
      });

      if (response.ok) {
        alert("Company created successfully!");
        refreshData(); // Refresh the company list
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        alert(`Failed to create company: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Failed to submit new company form:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Company</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Company Name" required className="w-full p-2 border rounded" />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded" />
        <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full p-2 border rounded" />
        <input name="zip" value={formData.zip} onChange={handleChange} placeholder="Zip Code" className="w-full p-2 border rounded" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
        <input name="dotNumber" value={formData.dotNumber} onChange={handleChange} placeholder="DOT Number" className="w-full p-2 border rounded" />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Company"}
        </Button>
      </form>
    </div>
  );
} 