import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET accidents for a company
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
        type: 'ACCIDENT',
        roleId: { in: roleIds },
      },
      include: {
        Accident: true,
      },
    });

    return NextResponse.json(issues);
  } catch (error) {
    console.error('Failed to fetch accidents:', error);
    return NextResponse.json({ error: 'Failed to fetch accidents' }, { status: 500 });
  }
}

// POST a new accident
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      companyId, 
      date, 
      isFatality, 
      isReportable, 
      isInjury, 
      isTow, 
      isCitation, 
      isNeedReport, 
      isDrugTest, 
      numberFatalities, 
      locationAddress, 
      locationCity, 
      locationState, 
      locationZip, 
      reportNumber, 
      specimenNumber, 
      description, 
      notes 
    } = body;

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
        type: 'ACCIDENT',
        status: 'OK',
        date: new Date(date),
        roleId: role.id,
        Accident: {
          create: {
            isFatality,
            isReportable,
            isInjury,
            isTow,
            isCitation,
            isNeedReport,
            isDrugTest,
            numberFatalities,
            locationAddress,
            locationCity,
            locationState,
            locationZip,
            reportNumber,
            specimenNumber,
            description,
            notes,
            attachments: {},
          },
        },
      },
      include: {
        Accident: true,
      },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error('Failed to create accident:', error);
    return NextResponse.json({ error: 'Failed to create accident' }, { status: 500 });
  }
} 