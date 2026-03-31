import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { m3uContent } = body;

    if (!m3uContent) {
      return NextResponse.json(
        { error: 'M3U content is required' },
        { status: 400 }
      );
    }

    // Parse M3U content
    const lines = m3uContent.split('\n');
    const channels = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        const name = line.split(',')[1]?.trim() || 'Unknown';
        const url = lines[i + 1]?.trim();
        
        if (url && !url.startsWith('#')) {
          channels.push({ name, url });
        }
      }
    }

    return NextResponse.json({ success: true, channels });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to parse M3U' },
      { status: 500 }
    );
  }
}
