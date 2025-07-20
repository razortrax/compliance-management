"use client";
import { useState, createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";
import SelectorDrawer from "./SelectorDrawer";
import { useCompanyContext } from "./CompanyProvider";
import { useEffect } from "react";

// Create context for selector state
interface SelectorContextType {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  showSelector: boolean;
  drivers: any[];
  equipment: any[];
}

const SelectorContext = createContext<SelectorContextType | null>(null);

export const useSelectorContext = () => {
  const context = useContext(SelectorContext);
  if (!context) {
    throw new Error("useSelectorContext must be used within a SelectorProvider");
  }
  return context;
};

export default function SelectorProvider({ children }: { children?: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { selectedCompany } = useCompanyContext();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCompany) return;
      setIsLoading(true);
      try {
        const [driversRes, equipmentRes] = await Promise.all([
          fetch(`/api/drivers?companyId=${selectedCompany.id}`),
          fetch(`/api/equipment?companyId=${selectedCompany.id}`),
        ]);
        const [driversData, equipmentData] = await Promise.all([
          driversRes.json(),
          equipmentRes.json(),
        ]);
        setDrivers(driversData);
        setEquipment(equipmentData);
      } catch (error) {
        console.error("Failed to fetch selector data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedCompany]);

  // Determine default selector type based on current path
  let defaultType: "drivers" | "equipment" = "drivers";
  if (pathname.startsWith("/equipment")) {
    defaultType = "equipment";
  } else if (pathname.startsWith("/drivers")) {
    defaultType = "drivers";
  }

  // Extract locationId from pathname if we're on a location page
  const locationMatch = pathname.match(/^\/locations\/([^\/]+)/);
  const locationId = locationMatch ? locationMatch[1] : undefined;

  // Create a context key that only changes when switching between driver/equipment
  const contextKey = pathname.startsWith("/equipment") ? "equipment" : 
                    pathname.startsWith("/drivers") ? "drivers" : "other";

  // Check if current path is a list page (exact matches for list pages)
  const isListPage = pathname === "/drivers" || 
                    pathname === "/equipment" || 
                    pathname === "/organization" ||
                    pathname === "/settings" ||
                    pathname === "/issues" ||
                    pathname === "/";

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const contextValue: SelectorContextType = {
    isOpen,
    handleOpen,
    handleClose,
    showSelector: !isListPage,
    drivers,
    equipment,
  };

  return (
    <SelectorContext.Provider value={contextValue}>
      <SelectorDrawer
        isOpen={isOpen}
        onClose={handleClose}
        title={defaultType === "drivers" ? "Select Driver" : "Select Equipment"}
        items={defaultType === "drivers" ? drivers : equipment}
        onSelect={(item) => {
          // Handle item selection, e.g., navigate to the item's page
          handleClose();
        }}
      />
      {children}
    </SelectorContext.Provider>
  );
}

// Keep the old hook for backward compatibility, but make it use the context
export const useSelectorHandlers = () => {
  return useSelectorContext();
}; 