import RoleDetailLayoutClient from './RoleDetailLayoutClient';

export default async function RoleDetailLayout({ children, params }: { children: React.ReactNode; params: Promise<{ roleId: string }> }) {
  const { roleId } = await params;
  
  return <RoleDetailLayoutClient roleId={roleId}>{children}</RoleDetailLayoutClient>;
} 