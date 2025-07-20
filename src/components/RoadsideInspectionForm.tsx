"use client";
import { useState, useEffect } from 'react';
import ViolationSelector, { ViolationWithComments } from './ViolationSelector';
import FormField from './FormField';
import Button from '../ui/Button';

export interface RoadsideInspectionFormData {
  date: string;
  location: string;
  level: string;
  officerName: string;
  notes: string;
  violations: ViolationWithComments[];
}

interface RoadsideInspectionFormProps {
  onSubmit: (data: RoadsideInspectionFormData) => void;
  onCancel: () => void;
  initialData?: any;
  entityType: 'driver' | 'equipment' | 'company';
  entityName: string;
  entityId?: string;
  drivers?: any[];
  equipment?: any[];
  violations: any[];
}

export default function RoadsideInspectionForm({
  onSubmit,
  onCancel,
  initialData,
  entityType,
  entityName,
  entityId,
  drivers = [],
  equipment = [],
  violations,
}: RoadsideInspectionFormProps) {
  const [formData, setFormData] = useState<RoadsideInspectionFormData>({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    location: initialData?.location || '',
    level: initialData?.level || 'Level 1',
    officerName: initialData?.officerName || '',
    notes: initialData?.notes || '',
    violations: initialData?.violationComments || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleViolationsChange = (updatedViolations: ViolationWithComments[]) => {
    setFormData(prev => ({ ...prev, violations: updatedViolations }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Entity" id="entity">
        <p className="p-2 bg-gray-100 rounded border">{entityName} ({entityType})</p>
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Inspection Date" id="date">
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 border rounded" />
        </FormField>
        <FormField label="Location" id="location">
          <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full p-2 border rounded" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Inspection Level" id="level">
          <select name="level" value={formData.level} onChange={handleChange} className="w-full p-2 border rounded">
            <option>Level 1</option>
            <option>Level 2</option>
            <option>Level 3</option>
            <option>Level 4</option>
            <option>Level 5</option>
          </select>
        </FormField>
        <FormField label="Officer Name" id="officerName">
          <input type="text" name="officerName" value={formData.officerName} onChange={handleChange} className="w-full p-2 border rounded" />
        </FormField>
      </div>

      <ViolationSelector
        violations={violations}
        selectedViolations={formData.violations}
        onViolationsChange={handleViolationsChange}
        driver={entityType === 'driver' ? { id: entityId!, name: entityName } : undefined}
        equipment={entityType === 'equipment' ? [{ id: entityId!, name: entityName }] : equipment}
      />

      <FormField label="Notes / Officer Comments" id="notes">
        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full p-2 border rounded" />
      </FormField>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Inspection</Button>
      </div>
    </form>
  );
} 