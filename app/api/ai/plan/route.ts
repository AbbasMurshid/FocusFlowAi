import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { generateTaskPlan } from '@/lib/groq';

async function handler(req: AuthenticatedRequest) {
    try {
        const { tasks } = await req.json();
        if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
            return NextResponse.json({ error: 'Please provide a non‑empty array of tasks' }, { status: 400 });
        }
        const plan = await generateTaskPlan(tasks);
        return NextResponse.json({ message: 'Task plan generated successfully', plan });
    } catch (error: any) {
        console.error('AI plan generation error:', error);
        return NextResponse.json({ error: 'Failed to generate task plan', details: error.message }, { status: 500 });
    }
}

export const POST = withAuth(handler);
