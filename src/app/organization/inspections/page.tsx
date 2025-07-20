"use client";
import { useState, useEffect } from 'react';
import IssueMasterDetail from "../../../components/IssueMasterDetail";
import RoadsideInspectionForm from "../../../components/RoadsideInspectionForm";
import Modal from "../../../ui/Modal";
import { useCompanyContext } from "../../../components/CompanyProvider";
import Button from '@/ui/Button';
import EntityIcon from '@/components/EntityIcon';

export default function InspectionsPage() {
  const { selectedCompany } = useCompanyContext();
  const [inspections, setInspections] = useState<any[]>([]);
  const [violations, setViolations] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]); // New state for staff
  const [isLoading, setIsLoading] = useState(true);
  const [showNewInspectionModal, setShowNewInspectionModal] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (selectedCompany) {
        setIsLoading(true);
        try {
          const [inspectionsRes, violationsRes, staffRes] = await Promise.all([
            fetch(`/api/inspections?companyId=${selectedCompany.id}`),
            fetch('/api/violations'),
            fetch(`/api/persons?companyId=${selectedCompany.id}`) // Fetch staff
          ]);
          const inspectionsData = await inspectionsRes.json();
          const violationsData = await violationsRes.json();
          const staffData = await staffRes.json(); // Get staff data
          setInspections(inspectionsData);
          setViolations(violationsData);
          setStaff(staffData); // Set staff data
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [selectedCompany]);

  const handleNewInspection = () => {
    setShowNewInspectionModal(true);
  };

  const handleSubmitInspection = async (formData: any) => {
    if (!selectedCompany) return;

    try {
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, companyId: selectedCompany.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to create inspection');
      }

      const newInspection = await response.json();
      setInspections(prev => [newInspection, ...prev]);
      setShowNewInspectionModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading inspections...</div>;
  }

  const inspectionDetails = inspections.map(i => i.RoadsideInspection).filter(Boolean);

  return (
    <main className="h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <EntityIcon type="organization" className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Roadside Inspections</h1>
          </div>
          <p className="text-gray-600">Track and manage all roadside inspections for {selectedCompany?.name}.</p>
        </div>
        <Button onClick={handleNewInspection}>New Inspection</Button>
      </div>

      <div className="flex-1">
        <IssueMasterDetail
          title="Roadside Inspections"
          issues={inspections}
          issueDetails={inspections.map(inspection => ({
            issueId: inspection.id,
            ...inspection.RoadsideInspection,
          }))}
          staff={staff} // Pass staff down
          violations={violations}
        />
      </div>

      <Modal
        isOpen={showNewInspectionModal}
        onClose={() => setShowNewInspectionModal(false)}
        title="New Roadside Inspection"
      >
        <RoadsideInspectionForm
          onSubmit={handleSubmitInspection}
          onCancel={() => setShowNewInspectionModal(false)}
          entityType="company"
          entityName={selectedCompany?.name || "Organization"}
          violations={violations}
        />
      </Modal>
    </main>
  );
} 