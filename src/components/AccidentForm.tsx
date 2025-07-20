"use client";
import { useState } from 'react';
import ViolationSelector, { ViolationWithComments } from './ViolationSelector';
import FormField from './FormField';
import Button from '../ui/Button';

export interface AccidentFormData {
  date: string;
  time: string;
  location: string;
  description: string;
  driverId: string;
  equipmentIds: string[];
  injuries: boolean;
  fatalities: boolean;
  towAway: boolean;
  notes: string;
  violations: ViolationWithComments[];
}

interface AccidentFormProps {
  onSubmit: (data: AccidentFormData) => void;
  onCancel: () => void;
  initialData?: any;
  entityType: 'driver' | 'equipment' | 'company';
  entityName: string;
  drivers?: any[];
  equipment?: any[];
  violations: any[];
}

export default function AccidentForm({
  onSubmit,
  onCancel,
  initialData,
  entityType,
  entityName,
  drivers = [],
  equipment = [],
  violations,
}: AccidentFormProps) {
  const [formData, setFormData] = useState<AccidentFormData>({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    time: initialData?.time || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    driverId: initialData?.driverId || '',
    equipmentIds: initialData?.equipmentIds || [],
    injuries: initialData?.injuries || false,
    fatalities: initialData?.fatalities || false,
    towAway: initialData?.towAway || false,
    notes: initialData?.notes || '',
    violations: initialData?.violations || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleEquipmentChange = (equipmentId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      equipmentIds: checked
        ? [...prev.equipmentIds, equipmentId]
        : prev.equipmentIds.filter(id => id !== equipmentId),
    }));
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
        <FormField label="Accident Date" id="date">
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 border rounded" />
        </FormField>
        <FormField label="Accident Time" id="time">
          <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full p-2 border rounded" />
        </FormField>
      </div>

      <FormField label="Location" id="location">
        <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full p-2 border rounded" />
      </FormField>

      <FormField label="Description" id="description">
        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required className="w-full p-2 border rounded" />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Driver" id="driverId">
          <select name="driverId" value={formData.driverId} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select a driver</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>{driver.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Equipment" id="equipmentIds">
          <div className="h-32 overflow-y-auto border rounded p-2">
            {equipment.map(eq => (
              <div key={eq.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`eq-${eq.id}`}
                  checked={formData.equipmentIds.includes(eq.id)}
                  onChange={(e) => handleEquipmentChange(eq.id, e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor={`eq-${eq.id}`}>{eq.name}</label>
              </div>
            ))}
          </div>
        </FormField>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <input type="checkbox" name="injuries" checked={formData.injuries} onChange={handleChange} className="mr-2" />
          <label>Injuries Reported</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="fatalities" checked={formData.fatalities} onChange={handleChange} className="mr-2" />
          <label>Fatalities Reported</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="towAway" checked={formData.towAway} onChange={handleChange} className="mr-2" />
          <label>Tow-Away Required</label>
        </div>
      </div>

      <ViolationSelector
        violations={violations}
        selectedViolations={formData.violations}
        onViolationsChange={handleViolationsChange}
        equipment={[]}
      />

      <FormField label="Notes" id="notes">
        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full p-2 border rounded" />
      </FormField>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Accident</Button>
      </div>
    </form>
  );
} 