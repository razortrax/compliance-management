// Server component
import DriverDetailLayoutClient from './DriverDetailLayoutClient';

export default async function DriverDetailLayout({ children, params }: { children: React.ReactNode; params: Promise<{ driverId: string }> }) {
  const { driverId } = await params;
  return <DriverDetailLayoutClient driverId={driverId}>{children}</DriverDetailLayoutClient>;
} 