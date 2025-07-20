import EquipmentDetailLayoutClient from "./EquipmentDetailLayoutClient";

export default async function EquipmentDetailLayout({ children, params }: { children: React.ReactNode; params: Promise<{ equipmentId: string }> }) {
  const { equipmentId } = await params;
  
  return <EquipmentDetailLayoutClient equipmentId={equipmentId}>{children}</EquipmentDetailLayoutClient>;
} 