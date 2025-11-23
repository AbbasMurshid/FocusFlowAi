import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/lib/middleware';

import { AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest) {
    const { userId } = req;
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (req.method !== 'PUT') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    try {
        await dbConnect();
        const body = await req.json();
        const { preferences, name, mfaEnabled } = body;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (name) user.name = name;
        if (typeof mfaEnabled === 'boolean') {
            user.mfaEnabled = mfaEnabled;
            if (!mfaEnabled) {
                user.mfaSecret = undefined; // Clear secret if disabled
            }
        }
        if (preferences) {
            user.preferences = { ...user.preferences, ...preferences };
        }

        await user.save();

        return NextResponse.json({
            message: 'Settings updated successfully',
            user: {
                name: user.name,
                email: user.email,
                preferences: user.preferences
            }
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const PUT = withAuth(handler);
