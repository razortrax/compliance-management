"use client";
import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import ViolationSelector from './ViolationSelector';
import Button from "../ui/Button"; // Import Button
import CorrectiveActionForm from "./CorrectiveActionForm"; // Import the new form

// All the interfaces can be moved to a central types file later

interface CorrectiveAction {
  id: string;
  issueId: string;
  [key: string]: any;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface IssueDetail {
  issueId: string;
  notes?: string;
  attachments?: Attachment[];
  violations?: any[];
  [key: string]: any;
}

interface Issue {
  id: string;
  status: string;
  expiresOn: string;
  type?: string;
  details?: IssueDetail;
  [key: string]: any;
}

interface IssueMasterDetailProps {
  issues: Issue[];
  issueDetails?: any[];
  violations: any[];
  title: string;
  staff?: any[]; // Accept staff prop
  onEdit?: (issue: Issue, details: any) => void;
  onAdd?: () => void;
  selectedIssueId?: string | null;
  onIssueSelect?: (issueId: string) => void;
}

export default function IssueMasterDetail({
  issues,
  issueDetails, 
  title,
  onEdit,
  onAdd,
  selectedIssueId: externalSelectedIssueId,
  onIssueSelect,
  violations,
  staff, // Destructure staff
}: IssueMasterDetailProps) {
  const [internalSelectedIssueId, setInternalSelectedIssueId] = useState<string | null>(null);
  const [showCorrectiveActionModal, setShowCorrectiveActionModal] = useState(false);

  const selectedIssueId = externalSelectedIssueId !== undefined ? externalSelectedIssueId : internalSelectedIssueId;
  const setSelectedIssueId = onIssueSelect || setInternalSelectedIssueId;

  useEffect(() => {
    if (issues.length > 0 && !selectedIssueId) {
      // setSelectedIssueId(issues[0].id);
    }
  }, [issues, selectedIssueId, setSelectedIssueId]);

  const selectedIssue = issues.find(issue => issue.id === selectedIssueId);
  const selectedDetails = selectedIssue?.details;

  const handleCorrectiveActionSubmit = async (data: any) => {
    // TODO: Add logged-in user's ID to assignedById
    console.log("Submitting corrective action:", data);
    try {
      const res = await fetch('/api/corrective-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setShowCorrectiveActionModal(false);
        // We might want to refresh the issue details here to show the new CAF
      } else {
        console.error("Failed to create corrective action");
      }
    } catch (error) {
      console.error("Error submitting corrective action:", error);
    }
  };

  const renderIssueDetails = (issue: Issue, details: IssueDetail | undefined) => {
    if (!details) return <div>No details available</div>;

    return (
      <div>
        {/* Render details based on issue.type */}
        { (issue.type === 'ACCIDENT' || issue.type === 'ROADSIDE_INSPECTION') &&
          <>
            <div className="flex justify-between items-center mt-4">
              <h4 className="font-semibold">Violations</h4>
              <Button onClick={() => setShowCorrectiveActionModal(true)}>
                Initiate Corrective Action
              </Button>
            </div>
            <ViolationSelector
              violations={violations}
              selectedViolations={details.violations || []}
              onViolationsChange={() => {}} // Placeholder
              equipment={[]}
            />
          </>
        }
      </div>
    );
  };
  
  return (
    <div>
      {/* ... existing master-detail layout ... */}
      
      {selectedIssue && (
        <Modal
          isOpen={showCorrectiveActionModal}
          onClose={() => setShowCorrectiveActionModal(false)}
          title={`Create Corrective Action for Issue #${selectedIssue.id}`}
        >
          <CorrectiveActionForm
            issueId={selectedIssue.id}
            violations={selectedIssue.details?.violations || []}
            staff={staff || []} // Pass staff to the form
            onSubmit={handleCorrectiveActionSubmit}
            onCancel={() => setShowCorrectiveActionModal(false)}
          />
        </Modal>
      )}

    </div>
  )
} 