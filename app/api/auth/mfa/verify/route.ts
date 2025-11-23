import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/lib/middleware';
import { authenticator } from 'otplib';

import { AuthenticatedRequest } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest) {
    const { userId } = req;
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    try {
        await dbConnect();
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        const user = await User.findById(userId).select('+mfaSecret');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.mfaSecret) {
            return NextResponse.json({ error: 'MFA setup not initiated' }, { status: 400 });
        }

        const isValid = authenticator.check(token, user.mfaSecret);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
        }

        user.mfaEnabled = true;
        await user.save();

        return NextResponse.json({ message: 'MFA enabled successfully' });
    } catch (error) {
        console.error('Error verifying MFA:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const POST = withAuth(handler);
