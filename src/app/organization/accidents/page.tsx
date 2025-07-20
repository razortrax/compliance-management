"use client";
import { useState, useEffect } from 'react';
import IssueMasterDetail from "../../../components/IssueMasterDetail";
import AccidentForm from "../../../components/AccidentForm";
import Modal from "../../../ui/Modal";
import { useCompanyContext } from "../../../components/CompanyProvider";
import Button from '@/ui/Button';
import EntityIcon from '@/components/EntityIcon';

export default function AccidentsPage() {
  const { selectedCompany } = useCompanyContext();
  const [accidents, setAccidents] = useState<any[]>([]);
  const [violations, setViolations] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewAccidentModal, setShowNewAccidentModal] = useState(false);
  
  useEffect(() => {
    if (selectedCompany) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [accidentsRes, violationsRes, staffRes] = await Promise.all([
            fetch(`/api/accidents?companyId=${selectedCompany.id}`),
            fetch('/api/violations'),
            fetch(`/api/persons?companyId=${selectedCompany.id}`)
          ]);
          const accidentsData = await accidentsRes.json();
          const violationsData = await violationsRes.json();
          const staffData = await staffRes.json();
          setAccidents(accidentsData);
          setViolations(violationsData);
          setStaff(staffData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedCompany]);

  const handleNewAccident = () => {
    setShowNewAccidentModal(true);
  };

  const handleSubmitAccident = async (formData: any) => {
    if (!selectedCompany) return;

    try {
      const response = await fetch('/api/accidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, companyId: selectedCompany.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to create accident');
      }

      const newAccident = await response.json();
      setAccidents(prev => [newAccident, ...prev]);
      setShowNewAccidentModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading accidents...</div>;
  }

  const accidentDetails = accidents.map(a => a.Accident).filter(Boolean);

  return (
    <main className="h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <EntityIcon type="organization" className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Accidents</h1>
          </div>
          <p className="text-gray-600">Track and manage all accidents for {selectedCompany?.name}.</p>
        </div>
        <Button onClick={handleNewAccident}>New Accident</Button>
      </div>

      <div className="flex-1">
        <IssueMasterDetail
          title="Accidents"
          issues={accidents}
          issueDetails={accidents.map(accident => ({
            issueId: accident.id,
            ...accident.Accident,
          }))}
          violations={violations}
          staff={staff}
        />
      </div>
      
      <Modal
        isOpen={showNewAccidentModal}
        onClose={() => setShowNewAccidentModal(false)}
        title="New Accident"
      >
        <AccidentForm
          onSubmit={handleSubmitAccident}
          onCancel={() => setShowNewAccidentModal(false)}
          entityType="company"
          entityName={selectedCompany?.name || "Organization"}
          violations={violations}
        />
      </Modal>
    </main>
  );
} 