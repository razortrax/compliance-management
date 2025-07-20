import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');

  if (!companyId) {
    return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
  }

  try {
    const roles = await prisma.role.findMany({
      where: {
        OR: [
          { managedOrgId: companyId },
          { managingOrgId: companyId },
          { person: { user: { companyId: companyId } } },
          { equipment: { roles: { some: { person: { user: { companyId: companyId } } } } } } // This logic might need refinement based on exact schema
        ],
      },
      select: {
        id: true,
      },
    });

    const roleIds = roles.map((role: { id: string }) => role.id);

    const issues = await prisma.issue.findMany({
      where: {
        roleId: {
          in: roleIds,
        },
      },
      include: {
        role: true, // Include role details if needed
      },
    });

    return NextResponse.json(issues);
  } catch (error) {
    console.error('Failed to fetch issues:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
} 