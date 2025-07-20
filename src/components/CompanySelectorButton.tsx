"use client";
import { useCompanyContext } from "./CompanyProvider";
import Button from "@/ui/Button";

interface CompanySelectorButtonProps {
  onClick: () => void;
  className?: string;
}

export default function CompanySelectorButton({ onClick, className }: CompanySelectorButtonProps) {
  const { isMasterUser, selectedCompany } = useCompanyContext();

  if (!isMasterUser) {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      className={`w-full h-12 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center gap-2 ${className}`}
      title="Select Company"
    >
      <span className="text-sm font-medium">
        {selectedCompany ? selectedCompany.name : "Select Company"}
      </span>
    </Button>
  );
} 