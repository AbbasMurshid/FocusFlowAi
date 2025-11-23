import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest, errorHandler } from '@/lib/middleware';
import { generateMotivation } from '@/lib/groq';

async function handler(req: AuthenticatedRequest) {
    try {
        const { context, mood } = await req.json();

        if (!context) {
            return NextResponse.json(
                { error: 'Please provide context' },
                { status: 400 }
            );
        }

        const motivation = await generateMotivation(context, mood);

        return NextResponse.json({
            message: 'Motivation generated successfully',
            motivation,
        });
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const POST = withAuth(handler);
