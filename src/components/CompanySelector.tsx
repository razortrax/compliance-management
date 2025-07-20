"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, Building2, Check, Plus, X } from "lucide-react";

// The component now expects a pre-filtered list of companies
interface CompanySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  companies: any[]; // Expects an array of organization objects
  selectedCompanyId?: string;
  onCompanySelect: (companyId: string) => void;
}

export default function CompanySelector({ 
  isOpen, 
  onClose, 
  companies,
  selectedCompanyId,
  onCompanySelect 
}: CompanySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter the received companies list based on the local search term
  const filteredCompanies = companies.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (org.dotNumber && org.dotNumber.includes(searchTerm))
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Building2 className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Select Company</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Company List */}
        <div className="flex-1 overflow-y-auto">
          {filteredCompanies.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? "No companies found" : "No companies available"}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCompanies.map((org) => (
                <div
                  key={org.id}
                  onClick={() => {
                    onCompanySelect(org.id);
                    onClose();
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedCompanyId === org.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">{org.name}</h3>
                          <p className="text-sm text-gray-500">DOT: {org.dotNumber}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              org.safetyRating === "Satisfactory" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {org.safetyRating}
                            </span>
                            <span className="text-xs text-gray-500">
                              {org.city}, {org.state}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedCompanyId === org.id && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              // TODO: Implement add company functionality
              console.log("Add new company");
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Company</span>
          </button>
        </div>
      </div>
    </div>
  );
} 