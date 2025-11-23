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
    if (req.method !== 'DELETE') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    try {
        await dbConnect();

        // Delete all user data
        await Promise.all([
            Task.deleteMany({ userId }),
            Note.deleteMany({ userId }),
            Goal.deleteMany({ userId }),
            FocusSession.deleteMany({ userId }),
            User.findByIdAndDelete(userId)
        ]);

        return NextResponse.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const DELETE = withAuth(handler);
