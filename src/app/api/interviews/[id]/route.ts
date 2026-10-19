import { NextRequest, NextResponse } from 'next/server';
import { getInterviewById } from '@/lib/db';


export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const interview = getInterviewById(id);

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json(interview);
  } catch (err: unknown) {
    console.error('Error fetching interview by id:', err);
    return NextResponse.json({ error: 'Failed to fetch interview' }, { status: 500 });
  }
}
