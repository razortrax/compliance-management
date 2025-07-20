import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const organizations = await prisma.organization.findMany();
    return NextResponse.json(organizations);
  } catch (error) {
    console.error('[API_ORGANIZATIONS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 