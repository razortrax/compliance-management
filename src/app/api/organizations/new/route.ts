import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, city, state, zip, phone, email, dotNumber, managingOrgId } = body;

    if (!name || !managingOrgId) {
      return NextResponse.json({ error: 'Company name and managing organization are required.' }, { status: 400 });
    }

    // Create the new sub-organization
    const newOrganization = await prisma.organization.create({
      data: {
        name,
        address,
        city,
        state,
        zip,
        phone,
        email,
        dotNumber,
        type: 'SUB_ORGANIZATION',
        status: 'ACTIVE',
        complianceStatus: 'PENDING', // Add default compliance status
      },
    });

    // Create a role to link the master org to the new sub-org
    await prisma.role.create({
      data: {
        roleType: 'MANAGED_BY',
        managingOrgId: managingOrgId,
        managedOrgId: newOrganization.id,
        startDate: new Date(), // Set the start date for the new role
      },
    });

    return NextResponse.json(newOrganization);

  } catch (error) {
    console.error('[API_ORGANIZATIONS_NEW_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 