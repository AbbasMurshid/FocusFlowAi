import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest, errorHandler } from '@/lib/middleware';
import { generateDailySchedule } from '@/lib/groq';

async function handler(req: AuthenticatedRequest) {
    try {
        const { tasks, workingHours, preferences } = await req.json();

        if (!tasks || !Array.isArray(tasks)) {
            return NextResponse.json(
                { error: 'Please provide tasks array' },
                { status: 400 }
            );
        }

        const defaultWorkingHours = workingHours || { start: '09:00', end: '17:00' };
        const defaultPreferences = preferences || {
            focusDuration: 25,
            breakDuration: 5,
        };

        const schedule = await generateDailySchedule(
            tasks,
            defaultWorkingHours,
            defaultPreferences
        );

        return NextResponse.json({
            message: 'Daily schedule generated successfully',
            schedule,
        });
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const POST = withAuth(handler);
