"use client";
import Link from "next/link";
import { useCompanyContext } from "./CompanyProvider";
import CompanySelectorButton from "./CompanySelectorButton";

export default function Navbar() {
  const { 
    currentUser, 
    isMasterUser, 
    showCompanySelector,
    handleCompanySelectorOpen 
  } = useCompanyContext();

  const getUserRoleDisplay = () => {
    if (!currentUser) return "";
    switch (currentUser.role) {
      case "ADMIN": return "Master";
      case "MANAGER": return "Company Manager";
      case "LOCATION_MANAGER": return "Location Manager";
      default: return currentUser.role;
    }
  };

  const getUserFirstName = () => {
    if (!currentUser) return "";
    return currentUser.name?.split(" ")[0] || currentUser.name;
  };

  return (
    <nav className="bg-gray-800 text-white h-16 flex items-center">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            ComplianceCo
          </Link>
          {showCompanySelector && (
            <CompanySelectorButton onClick={handleCompanySelectorOpen} />
          )}
        </div>

        <div className="flex items-center space-x-6">
          {/* Main navigation links */}
          <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          
          {isMasterUser || currentUser?.role === "MANAGER" ? (
            <Link href="/organization/overview" className="hover:text-gray-300">Organization</Link>
          ) : (
            <Link href={`/locations/${currentUser?.locationId}`} className="hover:text-gray-300">Location</Link>
          )}

          <Link href="/issues" className="hover:text-gray-300">Issues</Link>
          <Link href="/settings/companies" className="hover:text-gray-300">Settings</Link>

          {/* User greeting */}
          {currentUser && (
            <div className="flex items-center space-x-2 ml-6 pl-6 border-l border-gray-600">
              <span className="text-sm text-gray-300">
                Hello {getUserFirstName()}
              </span>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                {getUserRoleDisplay()}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 