import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Status count calculation utilities
export function getStatusCounts(issues: any[], roleId: string) {
  const roleIssues = issues.filter(issue => issue.roleId === roleId);
  const counts = {
    expired: 0,
    due30: 0,
    due60: 0,
    ok: 0
  };
  
  roleIssues.forEach(issue => {
    switch (issue.status) {
      case 'EXPIRED':
        counts.expired++;
        break;
      case 'DUE_30':
        counts.due30++;
        break;
      case 'DUE_60':
        counts.due60++;
        break;
      case 'OK':
        counts.ok++;
        break;
    }
  });
  
  return counts;
}

export function getStatusIndicator(counts: { expired: number; due30: number; due60: number; ok: number }) {
  const total = counts.expired + counts.due30 + counts.due60;
  
  if (total === 0) return null;
  
  // Priority: expired > due30 > due60
  if (counts.expired > 0) {
    return {
      count: counts.expired,
      color: 'status-expired',
      label: 'Expired'
    };
  } else if (counts.due30 > 0) {
    return {
      count: counts.due30,
      color: 'status-due30',
      label: 'Due in 30 days'
    };
  } else if (counts.due60 > 0) {
    return {
      count: counts.due60,
      color: 'status-due60',
      label: 'Due in 60 days'
    };
  }
  
  return null;
}

// Utility function to check if a path matches the current pathname
export function isActivePath(currentPathname: string, href: string): boolean {
  // Exact match
  if (currentPathname === href) return true;
  
  // For overview pages, also match the base path
  if (href.endsWith('/overview') && currentPathname === href.replace('/overview', '')) return true;
  
  // For nested paths, check if current path starts with the href
  if (href !== '/' && currentPathname.startsWith(href)) return true;
  
  return false;
}

// Utility function to get the active class for sidebar items
export function getActiveSidebarClass(isActive: boolean): string {
  return isActive 
    ? "sidebar-item-active" 
    : "sidebar-item";
}
