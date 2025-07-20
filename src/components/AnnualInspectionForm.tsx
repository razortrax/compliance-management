"use client";

import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card } from '../ui/Card';

interface AnnualInspectionFormProps {
  onSubmit: (inspectionData: AnnualInspectionFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AnnualInspectionFormData>;
  equipmentName: string;
}

export interface AnnualInspectionFormData {
  date: string;
  inspectorName: string;
  inspectorLicense: string;
  inspectionType: string;
  inspectionLevel: string;
  overallCondition: string;
  defects: string[];
  repairsRequired: string[];
  repairsCompleted: string[];
  nextInspectionDue: string;
  notes: string;
  passed: boolean;
  certificateNumber: string;
  facilityName: string;
  facilityAddress: string;
}

export default function AnnualInspectionForm({ 
  onSubmit, 
  onCancel, 
  initialData = {},
  equipmentName 
}: AnnualInspectionFormProps) {
  const [formData, setFormData] = useState<AnnualInspectionFormData>({
    date: '',
    inspectorName: '',
    inspectorLicense: '',
    inspectionType: 'Annual',
    inspectionLevel: 'Level 1',
    overallCondition: 'Good',
    defects: [],
    repairsRequired: [],
    repairsCompleted: [],
    nextInspectionDue: '',
    notes: '',
    passed: true,
    certificateNumber: '',
    facilityName: '',
    facilityAddress: '',
    ...initialData
  });

  const [newDefect, setNewDefect] = useState('');
  const [newRepairRequired, setNewRepairRequired] = useState('');
  const [newRepairCompleted, setNewRepairCompleted] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addDefect = () => {
    if (newDefect.trim()) {
      setFormData(prev => ({
        ...prev,
        defects: [...prev.defects, newDefect.trim()]
      }));
      setNewDefect('');
    }
  };

  const removeDefect = (index: number) => {
    setFormData(prev => ({
      ...prev,
      defects: prev.defects.filter((_, i) => i !== index)
    }));
  };

  const addRepairRequired = () => {
    if (newRepairRequired.trim()) {
      setFormData(prev => ({
        ...prev,
        repairsRequired: [...prev.repairsRequired, newRepairRequired.trim()]
      }));
      setNewRepairRequired('');
    }
  };

  const removeRepairRequired = (index: number) => {
    setFormData(prev => ({
      ...prev,
      repairsRequired: prev.repairsRequired.filter((_, i) => i !== index)
    }));
  };

  const addRepairCompleted = () => {
    if (newRepairCompleted.trim()) {
      setFormData(prev => ({
        ...prev,
        repairsCompleted: [...prev.repairsCompleted, newRepairCompleted.trim()]
      }));
      setNewRepairCompleted('');
    }
  };

  const removeRepairCompleted = (index: number) => {
    setFormData(prev => ({
      ...prev,
      repairsCompleted: prev.repairsCompleted.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Annual Inspection for {equipmentName}
        </h3>
        <p className="text-blue-700 text-sm">
          Complete the annual inspection form for this equipment. This inspection is required by DOT regulations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="md:col-span-2">
          <h4 className="text-lg font-semibold mb-4">Inspection Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspection Date *
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Inspection Due *
              </label>
              <Input
                type="date"
                value={formData.nextInspectionDue}
                onChange={(e) => setFormData(prev => ({ ...prev, nextInspectionDue: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspector Name *
              </label>
              <Input
                value={formData.inspectorName}
                onChange={(e) => setFormData(prev => ({ ...prev, inspectorName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspector License Number *
              </label>
              <Input
                value={formData.inspectorLicense}
                onChange={(e) => setFormData(prev => ({ ...prev, inspectorLicense: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspection Level
              </label>
              <select
                value={formData.inspectionLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, inspectionLevel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Level 1">Level 1</option>
                <option value="Level 2">Level 2</option>
                <option value="Level 3">Level 3</option>
                <option value="Level 4">Level 4</option>
                <option value="Level 5">Level 5</option>
                <option value="Level 6">Level 6</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overall Condition
              </label>
              <select
                value={formData.overallCondition}
                onChange={(e) => setFormData(prev => ({ ...prev, overallCondition: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="Out of Service">Out of Service</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Facility Information */}
        <Card>
          <h4 className="text-lg font-semibold mb-4">Facility Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facility Name *
              </label>
              <Input
                value={formData.facilityName}
                onChange={(e) => setFormData(prev => ({ ...prev, facilityName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facility Address *
              </label>
              <textarea
                value={formData.facilityAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, facilityAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Number
              </label>
              <Input
                value={formData.certificateNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, certificateNumber: e.target.value }))}
              />
            </div>
          </div>
        </Card>

        {/* Inspection Results */}
        <Card>
          <h4 className="text-lg font-semibold mb-4">Inspection Results</h4>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.passed}
                  onChange={(e) => setFormData(prev => ({ ...prev, passed: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Inspection Passed</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Additional notes about the inspection..."
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Defects Section */}
      <Card>
        <h4 className="text-lg font-semibold mb-4">Defects Found</h4>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newDefect}
              onChange={(e) => setNewDefect(e.target.value)}
              placeholder="Add a defect..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDefect())}
            />
            <Button type="button" onClick={addDefect} className="px-4">
              Add
            </Button>
          </div>
          {formData.defects.length > 0 && (
            <div className="space-y-2">
              {formData.defects.map((defect, index) => (
                <div key={index} className="flex items-center justify-between bg-red-50 p-3 rounded">
                  <span className="text-sm">{defect}</span>
                  <Button
                    type="button"
                    onClick={() => removeDefect(index)}
                    className="text-red-600 hover:text-red-800 px-2 py-1"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Repairs Required */}
      <Card>
        <h4 className="text-lg font-semibold mb-4">Repairs Required</h4>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newRepairRequired}
              onChange={(e) => setNewRepairRequired(e.target.value)}
              placeholder="Add required repair..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRepairRequired())}
            />
            <Button type="button" onClick={addRepairRequired} className="px-4">
              Add
            </Button>
          </div>
          {formData.repairsRequired.length > 0 && (
            <div className="space-y-2">
              {formData.repairsRequired.map((repair, index) => (
                <div key={index} className="flex items-center justify-between bg-yellow-50 p-3 rounded">
                  <span className="text-sm">{repair}</span>
                  <Button
                    type="button"
                    onClick={() => removeRepairRequired(index)}
                    className="text-yellow-600 hover:text-yellow-800 px-2 py-1"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Repairs Completed */}
      <Card>
        <h4 className="text-lg font-semibold mb-4">Repairs Completed</h4>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newRepairCompleted}
              onChange={(e) => setNewRepairCompleted(e.target.value)}
              placeholder="Add completed repair..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRepairCompleted())}
            />
            <Button type="button" onClick={addRepairCompleted} className="px-4">
              Add
            </Button>
          </div>
          {formData.repairsCompleted.length > 0 && (
            <div className="space-y-2">
              {formData.repairsCompleted.map((repair, index) => (
                <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded">
                  <span className="text-sm">{repair}</span>
                  <Button
                    type="button"
                    onClick={() => removeRepairCompleted(index)}
                    className="text-green-600 hover:text-green-800 px-2 py-1"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          {initialData.date ? 'Update Inspection' : 'Save Inspection'}
        </Button>
      </div>
    </form>
  );
} 