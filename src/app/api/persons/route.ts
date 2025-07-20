import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET persons for a company
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');

  if (!companyId) {
    return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
  }

  try {
    // We need to find users of a company, and then get the associated persons.
    const users = await prisma.user.findMany({
      where: { companyId: companyId },
      select: { personId: true }
    });

    const personIds = users
      .map((user: { personId: string | null }) => user.personId)
      .filter((id): id is string => id !== null);

    const persons = await prisma.person.findMany({
      where: {
        id: { in: personIds }
      }
    });

    return NextResponse.json(persons);
  } catch (error) {
    console.error('[API_PERSONS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 