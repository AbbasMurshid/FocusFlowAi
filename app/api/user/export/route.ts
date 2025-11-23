import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Task from '@/models/Task';
import Note from '@/models/Note';
import Goal from '@/models/Goal';
import FocusSession from '@/models/FocusSession';
import { withAuth } from '@/lib/middleware';

import { AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest) {
    const { userId } = req;
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    try {
        await dbConnect();

        const [user, tasks, notes, goals, sessions] = await Promise.all([
            User.findById(userId).select('-password -mfaSecret'),
            Task.find({ userId }),
            Note.find({ userId }),
            Goal.find({ userId }),
            FocusSession.find({ userId })
        ]);

        const exportData = {
            user,
            tasks,
            notes,
            goals,
            focusSessions: sessions,
            exportDate: new Date().toISOString()
        };

        return NextResponse.json(exportData);
    } catch (error) {
        console.error('Error exporting data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const GET = withAuth(handler);
