"use client";
import { useState } from 'react';
import Button from '@/ui/Button';
import Input from '@/ui/Input'; // Corrected import
import { Textarea } from '@/ui/Textarea'; // Assuming you have a Textarea component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/Select'; // Assuming Select

interface CorrectiveActionFormProps {
  issueId: string;
  violations: any[]; // The violations associated with the parent issue
  staff: any[]; // The list of staff members to assign to
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function CorrectiveActionForm({ issueId, violations, staff, onSubmit, onCancel }: CorrectiveActionFormProps) {
  const [selectedViolations, setSelectedViolations] = useState<string[]>([]);
  const [assignedToId, setAssignedToId] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      issueId,
      assignedToId,
      assignmentNotes,
      violations: violations.filter(v => selectedViolations.includes(v.id)),
      status: 'Assigned',
      // assignedById will need to be the currently logged-in user
    });
  };

  const handleViolationToggle = (violationId: string) => {
    setSelectedViolations(prev =>
      prev.includes(violationId)
        ? prev.filter(id => id !== violationId)
        : [...prev, violationId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="font-medium">Select Violations for Corrective Action</h3>
        <div className="mt-2 space-y-2">
          {violations.map(violation => (
            <div key={violation.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`violation-${violation.id}`}
                checked={selectedViolations.includes(violation.id)}
                onChange={() => handleViolationToggle(violation.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor={`violation-${violation.id}`} className="text-sm">
                {violation.code} - {violation.description}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="assignedTo" className="block text-sm font-medium">Assign To</label>
        <Select onValueChange={setAssignedToId} value={assignedToId}>
          <SelectTrigger id="assignedTo">
            <SelectValue placeholder="Select a staff member" />
          </SelectTrigger>
          <SelectContent>
            {staff.map(person => (
              <SelectItem key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="assignmentNotes" className="block text-sm font-medium">Instructions / Notes</label>
        <Textarea
          id="assignmentNotes"
          value={assignmentNotes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAssignmentNotes(e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Assign Corrective Action
        </Button>
      </div>
    </form>
  );
} 