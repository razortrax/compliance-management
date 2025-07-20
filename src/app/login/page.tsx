import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Building2, User, ArrowRight } from 'lucide-react';

async function loginUser(formData: FormData) {
  'use server';
  
  const userId = formData.get('userId') as string;
  if (userId) {
    // In a real app, you'd set a proper session/cookie here
    redirect(`/dashboard?userId=${userId}`);
  }
}

export default async function LoginPage() {
  // Fetch data server-side
  const [users, organizations, roles] = await Promise.all([
    prisma.user.findMany(),
    prisma.organization.findMany(),
    prisma.role.findMany()
  ]);

  const masterUsers = users.filter((user: any) => user.companyType === "MASTER");
  const subUsers = users.filter((user: any) => user.companyType === "SUB");

  // Helper function to safely get permissions
  const getPermissions = (permissions: any): string[] => {
    if (Array.isArray(permissions)) {
      return permissions;
    }
    if (typeof permissions === 'string') {
      try {
        return JSON.parse(permissions);
      } catch {
        return [];
      }
    }
    return [];
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          <div className="login-icon">
            <Building2 style={{ height: "24px", width: "24px", color: "#2563eb" }} />
          </div>
          <h2 className="login-title">
            Compliance App Login
          </h2>
          <p className="login-subtitle">
            Click a user to login and test functionality
          </p>
        </div>

        <form action={loginUser} className="login-form">
          {/* Master Company Users */}
          <div>
            <h3 className="user-section-title">
              <Building2 className="icon" style={{ color: "#2563eb" }} />
              Master Company Users
            </h3>
            <div className="user-buttons">
              {masterUsers.map((user: any) => {
                const masterCompany = organizations.find((c: any) => c.id === user.companyId && c.type === 'MASTER_ORGANIZATION');
                
                const managedCompanies = roles
                  .filter((role: any) => 
                    role.managingOrgId === user.companyId &&
                    role.roleType === "MANAGED_BY"
                  )
                  .map((role: any) => organizations.find((org: any) => org.id === role.managedOrgId))
                  .filter((org: any): org is NonNullable<typeof org> => org !== undefined);
                
                const permissions = getPermissions(user.permissions);
                
                return (
                  <button
                    key={user.id}
                    type="submit"
                    name="userId"
                    value={user.id}
                    className="user-button user-button-master"
                  >
                    <div className="user-button-content">
                      <div className="user-info">
                        <h4>🏢 {user.name} (MASTER MANAGER)</h4>
                        <p>{user.email}</p>
                        <p>{masterCompany?.name} • {managedCompanies.length} companies • {permissions.join(', ')}</p>
                      </div>
                      <ArrowRight style={{ width: "20px", height: "20px", color: "#2563eb" }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Company Users */}
          <div>
            <h3 className="user-section-title">
              <User className="icon" style={{ color: "#16a34a" }} />
              Sub-Company Users
            </h3>
            <div className="user-buttons">
              {subUsers.map((user: any) => {
                const subCompany = organizations.find((c: any) => c.id === user.companyId && c.type === 'SUB_ORGANIZATION');
                
                return (
                  <button
                    key={user.id}
                    type="submit"
                    name="userId"
                    value={user.id}
                    className="user-button user-button-sub"
                  >
                    <div className="user-button-content">
                      <div className="user-info">
                        <h4 className="sub-title">👤 {user.name}</h4>
                        <p>{user.email}</p>
                        <p>{subCompany?.name} • {user.role}</p>
                      </div>
                      <ArrowRight style={{ width: "20px", height: "20px", color: "#16a34a" }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        <div className="login-status">
          <p>
            ✅ <strong>Database Working:</strong> {users.length} users, {organizations.length} organizations loaded
          </p>
          <p className="success">
            <strong>Ready for Master Manager Development!</strong>
          </p>
        </div>
      </div>
    </div>
  );
} 