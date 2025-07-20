"use client";
import EntityIcon from "./EntityIcon";

interface SelectorButtonProps {
  onClick: () => void;
}

export default function SelectorButton({ onClick }: SelectorButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full h-12 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
      title="Select Drivers/Equipment"
    >
      <div className="flex items-center gap-1">
        <EntityIcon type="driver" className="w-5 h-5" />
        <EntityIcon type="equipment" className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium">Select</span>
    </button>
  );
} 