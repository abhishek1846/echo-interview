import { NextRequest, NextResponse } from 'next/server';
import { getAllInterviews, saveInterview } from '@/lib/db';
import { processAudioWithAssemblyAI } from '@/lib/assemblyai';


export async function GET() {
  try {
    const interviews = getAllInterviews();
    return NextResponse.json(interviews);
  } catch (err: unknown) {
    console.error('Error fetching interviews:', err);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const productName = (formData.get('product_name') as string) || 'Kroma Audio';

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`[API] Received audio file: ${audioFile.name || 'blob'} (${buffer.length} bytes)`);

    // Process with AssemblyAI Speech Intelligence
    const record = await processAudioWithAssemblyAI(buffer, productName);

    // Save to local database
    saveInterview(record);

    return NextResponse.json(record, { status: 201 });
  } catch (err: unknown) {
    console.error('Error processing interview:', err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
