import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET corrective actions for an issue
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const issueId = searchParams.get('issueId');

  if (!issueId) {
    return NextResponse.json({ error: 'issueId is required' }, { status: 400 });
  }

  try {
    const correctiveActions = await prisma.correctiveAction.findMany({
      where: {
        issueId: issueId,
      },
      include: {
        assignedBy: true,
        assignedTo: true,
      }
    });
    return NextResponse.json(correctiveActions);
  } catch (error) {
    console.error('[API_CORRECTIVE_ACTIONS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST a new corrective action
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      issueId,
      assignedById,
      assignedToId,
      assignmentNotes,
      violations,
      status
    } = body;

    if (!issueId || !assignedById || !assignedToId || !status) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const newCorrectiveAction = await prisma.correctiveAction.create({
      data: {
        issueId,
        assignedById,
        assignedToId,
        assignmentNotes,
        violations,
        status,
      },
    });

    return NextResponse.json(newCorrectiveAction);
  } catch (error) {
    console.error('[API_CORRECTIVE_ACTIONS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 