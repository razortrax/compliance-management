import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('[API_USERS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 