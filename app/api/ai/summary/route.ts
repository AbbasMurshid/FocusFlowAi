import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { summarizeNote } from '@/lib/groq';

async function handler(req: AuthenticatedRequest) {
    try {
        const { content } = await req.json();
        if (!content) {
            return NextResponse.json({ error: 'Please provide note content' }, { status: 400 });
        }
        const summary = await summarizeNote(content);
        return NextResponse.json({ message: 'Summary generated successfully', summary });
    } catch (error: any) {
        console.error('AI summary generation error:', error);
        return NextResponse.json({ error: 'Failed to generate summary', details: error.message }, { status: 500 });
    }
}

export const POST = withAuth(handler);
