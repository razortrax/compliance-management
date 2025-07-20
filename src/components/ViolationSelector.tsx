"use client";

import { useState, useMemo, useRef, useEffect } from 'react';

// These types should be defined in a central types file eventually
export interface ViolationWithComments {
  code: string;
  comment?: string;
  isOutOfService: boolean;
  association?: ViolationAssociation;
}

export interface ViolationAssociation {
  type: 'driver' | 'equipment' | 'company';
  id: string;
  name: string;
}

interface ViolationSelectorProps {
  violations: any[]; // All possible violations
  selectedViolations: ViolationWithComments[];
  onViolationsChange: (violations: ViolationWithComments[]) => void;
  driver?: { id: string; name: string };
  equipment: Array<{ id: string; name: string }>;
  companyId?: string;
  companyName?: string;
  placeholder?: string;
  className?: string;
}

const getViolationType = (code: string): 'Driver' | 'Equipment' | 'Company' | 'Other' => {
  if (code.startsWith('391') || code.startsWith('392')) return 'Driver';
  if (code.startsWith('393') || code.startsWith('396')) return 'Equipment';
  if (code.startsWith('390')) return 'Company';
  return 'Other';
};

export default function ViolationSelector({
  violations,
  selectedViolations,
  onViolationsChange,
  driver,
  equipment,
  companyId,
  companyName,
  placeholder = "Select violations...",
  className = "",
}: ViolationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      
      // A typical dropdown might be around 384px (max-h-96)
      // If less than that space is available below, open upwards.
      if (spaceBelow < 400 && rect.top > 400) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  const availableAssociations = useMemo(() => {
    const associations: ViolationAssociation[] = [];
    if (driver?.id && driver.name) {
      associations.push({ type: 'driver', id: driver.id, name: driver.name });
    }
    equipment.forEach(eq => {
      associations.push({ type: 'equipment', id: eq.id, name: eq.name });
    });
    if (companyId && companyName) {
      associations.push({ type: 'company', id: companyId, name: companyName });
    }
    return associations;
  }, [driver, equipment, companyId, companyName]);

  const filteredViolations = useMemo(() => {
    return violations.filter(violation => {
      const matchesSearch = violation.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           violation.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm, violations]);

  const handleViolationToggle = (code: string) => {
    const isSelected = selectedViolations.some(v => v.code === code);
    let newSelected: ViolationWithComments[];

    if (isSelected) {
      newSelected = selectedViolations.filter(v => v.code !== code);
    } else {
      const violationType = getViolationType(code);
      let defaultAssociation: ViolationAssociation | undefined;

      if (violationType === 'Driver' && driver) {
        defaultAssociation = { type: 'driver', id: driver.id, name: driver.name };
      } else if (violationType === 'Equipment' && equipment.length === 1) {
        defaultAssociation = { type: 'equipment', id: equipment[0].id, name: equipment[0].name };
      } else if (violationType === 'Company' && companyId && companyName) {
        defaultAssociation = { type: 'company', id: companyId, name: companyName };
      }

      newSelected = [...selectedViolations, { 
        code, 
        isOutOfService: false,
        association: defaultAssociation,
      }];
    }
    
    onViolationsChange(newSelected);
  };

  const handleCommentChange = (code: string, comment: string) => {
    const newSelected = selectedViolations.map(v => 
      v.code === code ? { ...v, comment } : v
    );
    onViolationsChange(newSelected);
  };

  const handleAssociationChange = (code: string, association: ViolationAssociation) => {
    const newSelected = selectedViolations.map(v =>
      v.code === code ? { ...v, association } : v
    );
    onViolationsChange(newSelected);
  };

  const handleOOSChange = (code: string, isOutOfService: boolean) => {
    const newSelected = selectedViolations.map(v =>
      v.code === code ? { ...v, isOutOfService } : v
    );
    onViolationsChange(newSelected);
  };
  
  const getViolationDetails = (code: string) => {
    return violations.find(v => v.code === code);
  };

  const selectedViolationDetails = selectedViolations.map(violation => ({
    ...violation,
    details: getViolationDetails(violation.code)
  })).filter(v => v.details);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div 
        className="min-h-[40px] border border-gray-300 rounded-md p-2 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedViolationDetails.length > 0 ? (
          <div className="space-y-2">
            {selectedViolationDetails.map((violation) => (
              <div key={violation.code} className="p-2 border rounded-md bg-gray-50">
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {violation.code}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViolationToggle(violation.code);
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                  <div>
                    <p className="font-semibold">{violation.details?.description}</p>
                    {violation.comment && (
                      <p className="text-xs text-gray-600 italic">&quot;{violation.comment}&quot;</p>
                    )}
                    {violation.association && (
                      <p className="text-xs text-green-700">Associated with: {violation.association.name}</p>
                    )}
                    {violation.isOutOfService && (
                      <p className="text-xs font-bold text-red-700">OUT OF SERVICE</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <div 
          className={`absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden ${
            dropdownPosition === 'bottom' ? 'mt-1' : 'bottom-full mb-1'
          }`}
        >
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search violations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-y-auto max-h-96">
            {filteredViolations.map((violation) => {
                const isSelected = selectedViolations.some(v => v.code === violation.code);
                const selectedViolation = selectedViolations.find(v => v.code === violation.code);
                const violationType = getViolationType(violation.code);
                
                let possibleAssociations = availableAssociations;
                if (violationType === 'Driver') {
                    possibleAssociations = availableAssociations.filter(a => a.type === 'driver' || a.type === 'company');
                } else if (violationType === 'Equipment') {
                    possibleAssociations = availableAssociations.filter(a => a.type === 'equipment' || a.type === 'company');
                }

                return (
                  <div key={violation.code} className={`p-3 border-b border-gray-100 ${isSelected ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start justify-between cursor-pointer" onClick={() => handleViolationToggle(violation.code)}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">{violation.code}</span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            violationType === 'Equipment' ? 'bg-red-100 text-red-800' :
                            violationType === 'Driver' ? 'bg-yellow-100 text-yellow-800' :
                            violationType === 'Company' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {violationType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{violation.description}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="ml-2 mt-1"
                      />
                    </div>
                    
                    {isSelected && (
                      <div className="mt-2 space-y-2 pl-4 border-l-2 border-blue-200" onClick={(e) => e.stopPropagation()}>
                        <textarea
                          value={selectedViolation?.comment || ''}
                          onChange={(e) => handleCommentChange(violation.code, e.target.value)}
                          placeholder="Add officer comment (optional)..."
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          rows={2}
                        />

                        {possibleAssociations.length > 0 && (
                            <div>
                                <label className="text-xs font-medium text-gray-700">Associate with:</label>
                                <select
                                    value={selectedViolation?.association ? JSON.stringify(selectedViolation.association) : ''}
                                    onChange={(e) => handleAssociationChange(violation.code, JSON.parse(e.target.value))}
                                    className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded"
                                >
                                    <option value="">Select...</option>
                                    {possibleAssociations.map(assoc => (
                                        <option key={assoc.id} value={JSON.stringify(assoc)}>
                                            {assoc.name} ({assoc.type})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`oos-${violation.code}`}
                                checked={selectedViolation?.isOutOfService || false}
                                onChange={(e) => handleOOSChange(violation.code, e.target.checked)}
                                className="h-4 w-4 text-red-600"
                            />
                            <label htmlFor={`oos-${violation.code}`} className="text-xs font-medium text-red-700">
                                Out of Service
                            </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 