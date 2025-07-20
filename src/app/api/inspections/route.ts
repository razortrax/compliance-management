import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET inspections for a company
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
        ],
      },
      select: { id: true },
    });
    const roleIds = roles.map((role: { id: string }) => role.id);

    const issues = await prisma.issue.findMany({
      where: {
        type: 'ROADSIDE_INSPECTION',
        roleId: { in: roleIds },
      },
      include: {
        RoadsideInspection: true,
      },
    });

    return NextResponse.json(issues);
  } catch (error) {
    console.error('Failed to fetch inspections:', error);
    return NextResponse.json({ error: 'Failed to fetch inspections' }, { status: 500 });
  }
}

// POST a new inspection
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyId, date, location, level, officerName, notes, violations } = body;

    // In a real app, you'd find the correct role to associate this with.
    // For now, let's find the first role associated with the company.
    const role = await prisma.role.findFirst({
      where: {
        OR: [
          { managedOrgId: companyId },
          { managingOrgId: companyId },
        ],
      },
    });

    if (!role) {
        return NextResponse.json({ error: 'No suitable role found for this company' }, { status: 400 });
    }

    const newIssue = await prisma.issue.create({
      data: {
        type: 'ROADSIDE_INSPECTION',
        status: 'OK', // Default status
        date: new Date(date),
        roleId: role.id,
        RoadsideInspection: {
          create: {
            location,
            level,
            officerName,
            notes,
            violations,
          },
        },
      },
      include: {
        RoadsideInspection: true,
      },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error('Failed to create inspection:', error);
    return NextResponse.json({ error: 'Failed to create inspection' }, { status: 500 });
  }
} 