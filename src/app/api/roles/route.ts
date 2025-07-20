import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const roles = await prisma.role.findMany();
    return NextResponse.json(roles);
  } catch (error) {
    console.error('[API_ROLES_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 