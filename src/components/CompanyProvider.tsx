"use client";
import { useState, createContext, useContext, ReactNode, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import CompanySelector from "./CompanySelector";

// Create context for company selection state
interface CompanyContextType {
  isCompanySelectorOpen: boolean;
  handleCompanySelectorOpen: () => void;
  handleCompanySelectorClose: () => void;
  currentCompanyId: string | null;
  setCurrentCompanyId: (companyId: string) => void;
  currentUser: any | null;
  isMasterUser: boolean;
  showCompanySelector: boolean;
  availableCompanies: any[];
  selectedCompany: any | null;
  isLoading: boolean;
  refreshData: () => void;
  // Location-based permissions
  userLocationId: string | null;
  canViewLocation: (locationId: string) => boolean;
  canManageLocation: (locationId: string) => boolean;
  canViewCompanyData: () => boolean;
  canManageCompanyData: () => boolean;
  getUserAccessibleLocations: () => string[];
}

const CompanyContext = createContext<CompanyContextType | null>(null);

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompanyContext must be used within a CompanyProvider");
  }
  return context;
};

export default function CompanyProvider({ children }: { children?: ReactNode }) {
  const [isCompanySelectorOpen, setIsCompanySelectorOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, orgsRes, rolesRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/organizations'),
          fetch('/api/roles')
        ]);
        const usersData = await usersRes.json();
        const orgsData = await orgsRes.json();
        const rolesData = await rolesRes.json();

        setUsers(usersData);
        setOrganizations(orgsData);
        setRoles(rolesData);

        // After data is fetched, set default user and company
        const demoUserId = localStorage.getItem("demoUserId");
        let initialUser = usersData.find((user: any) => user.id === demoUserId);

        if (!initialUser) {
          // Fallback to a default user if no demo user is set
          initialUser = usersData.find((user: any) => user.email === "john.master@example.com") || usersData[0];
        }

        if (initialUser) {
          setCurrentUser(initialUser);
          let initialCompanyId: string | null = localStorage.getItem("selectedCompanyId");

          if (initialUser.companyType === "MASTER") {
            const managedCompanies = getManagedCompanies(initialUser.companyId, rolesData, orgsData);
            
            // If no company is selected in localStorage, or if the selected one is invalid, pick the first available one.
            const isValidSelection = managedCompanies.some((c: any) => c && c.id === initialCompanyId);
            if (!initialCompanyId || !isValidSelection) {
              initialCompanyId = managedCompanies.length > 0 ? managedCompanies[0].id : null;
              if (initialCompanyId) {
                localStorage.setItem("selectedCompanyId", initialCompanyId);
              }
            }
          } else {
            // For non-master users, their company is fixed.
            initialCompanyId = initialUser.companyId;
          }
          
          setCurrentCompanyId(initialCompanyId);
        }
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getManagedCompanies = (masterOrgId: string, rolesData: any[], orgsData: any[]) => {
    if (!masterOrgId || !rolesData || !orgsData) return [];
    
    const managedOrgIds = rolesData
      .filter((role: any) => role.managingOrgId === masterOrgId && role.roleType === "MANAGED_BY")
      .map((role: any) => role.managedOrgId);
      
    return orgsData.filter((org: any) => managedOrgIds.includes(org.id));
  };
  
  const isMasterUser = currentUser?.companyType === "MASTER";
  const showCompanySelector = isMasterUser && !pathname.startsWith('/login') && !pathname.startsWith('/test-login');

  // Location-based permissions
  const userLocationId = currentUser?.locationId || null;
  
  const canViewLocation = (locationId: string): boolean => {
    // Master users can view all locations
    if (isMasterUser) return true;
    
    // Location managers can only view their assigned location
    if (currentUser?.role === "LOCATION_MANAGER") {
      return userLocationId === locationId;
    }
    
    // Company managers can view all locations in their company
    if (currentUser?.role === "MANAGER") {
      // Pass roles data directly to the helper function
      const companyLocations = getUserAccessibleLocations(roles, organizations);
      return companyLocations.includes(locationId);
    }
    
    return false;
  };
  
  const canManageLocation = (locationId: string): boolean => {
    // Master users can manage all locations
    if (isMasterUser) return true;
    
    // Location managers can only manage their assigned location
    if (currentUser?.role === "LOCATION_MANAGER") {
      return userLocationId === locationId;
    }
    
    // Company managers can manage all locations in their company
    if (currentUser?.role === "MANAGER") {
      // Pass roles data directly
      const companyLocations = roles
        .filter(
          (role: any) =>
            role.partyA_type === "ORGANIZATION" &&
            role.partyA_id === currentUser.companyId &&
            role.partyB_type === "ORGANIZATION" &&
            role.roleType === "LOCATION"
        )
        .map((role: any) => role.partyB_id);
      return companyLocations.includes(locationId);
    }
    
    return false;
  };
  
  const canViewCompanyData = (): boolean => {
    return (
      isMasterUser ||
      currentUser?.role === "MANAGER" ||
      currentUser?.role === "LOCATION_MANAGER"
    );
  };
  
  const canManageCompanyData = (): boolean => {
    return isMasterUser || currentUser?.role === "MANAGER";
  };
  
  // Updated getUserAccessibleLocations to accept data as arguments
  const getUserAccessibleLocations = (
    rolesData: any[],
    orgsData: any[]
  ): string[] => {
    if (isMasterUser && currentUser) {
      const managedCompanies = getManagedCompanies(
        currentUser.companyId,
        rolesData,
        orgsData
      );
      const allLocationIds: string[] = [];
      managedCompanies.forEach((company) => {
        if (company) {
          const companyLocations = rolesData
            .filter(
              (role) =>
                role.partyA_type === "ORGANIZATION" &&
                role.partyA_id === company.id &&
                role.partyB_type === "ORGANIZATION" &&
                role.roleType === "LOCATION"
            )
            .map((role) => role.partyB_id);
          allLocationIds.push(...companyLocations);
        }
      });
      return allLocationIds;
    }
    if (currentUser?.role === "MANAGER") {
      return rolesData
        .filter(
          (role) =>
            role.partyA_type === "ORGANIZATION" &&
            role.partyA_id === currentUser.companyId &&
            role.partyB_type === "ORGANIZATION" &&
            role.roleType === "LOCATION"
        )
        .map((role) => role.partyB_id);
    }
    if (currentUser?.role === "LOCATION_MANAGER" && userLocationId) {
      return [userLocationId];
    }
    return [];
  };

  const handleCompanySelectorOpen = () => {
    setIsCompanySelectorOpen(true);
  };

  const handleCompanySelectorClose = () => {
    setIsCompanySelectorOpen(false);
  };

  const handleCompanySelect = (companyId: string) => {
    setCurrentCompanyId(companyId);
    localStorage.setItem("selectedCompanyId", companyId);
    router.push("/organization/overview"); // Navigate to organization overview page
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  const availableCompanies = isMasterUser && currentUser ? getManagedCompanies(currentUser.companyId, roles, organizations) : [];
  const selectedCompany = organizations.find(org => org.id === currentCompanyId);


  return (
    <CompanyContext.Provider
      value={{
        isCompanySelectorOpen,
        handleCompanySelectorOpen,
        handleCompanySelectorClose,
        currentCompanyId,
        setCurrentCompanyId: handleCompanySelect,
        currentUser,
        isMasterUser,
        showCompanySelector,
        availableCompanies,
        selectedCompany,
        isLoading,
        refreshData: fetchData,
        // Location-based permissions
        userLocationId,
        canViewLocation,
        canManageLocation,
        canViewCompanyData,
        canManageCompanyData,
        getUserAccessibleLocations: () => getUserAccessibleLocations(roles, organizations),
      }}
    >
      {showCompanySelector && currentUser && (
        <CompanySelector
          isOpen={isCompanySelectorOpen}
          onClose={handleCompanySelectorClose}
          companies={getManagedCompanies(currentUser.companyId, roles, organizations)}
          selectedCompanyId={currentCompanyId || undefined}
          onCompanySelect={handleCompanySelect}
        />
      )}
      {children}
    </CompanyContext.Provider>
  );
} 