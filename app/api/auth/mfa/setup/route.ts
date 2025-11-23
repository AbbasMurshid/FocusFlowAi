import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/lib/middleware';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

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
        const user = await User.findById(userId).select('+mfaSecret');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.mfaEnabled) {
            return NextResponse.json({ error: 'MFA is already enabled' }, { status: 400 });
        }

        // Generate secret
        const secret = authenticator.generateSecret();

        // Save secret to user (but don't enable yet)
        user.mfaSecret = secret;
        await user.save();

        // Generate QR code
        const otpauth = authenticator.keyuri(user.email, 'Focus Flow', secret);
        const qrCodeUrl = await QRCode.toDataURL(otpauth);

        return NextResponse.json({
            secret,
            qrCodeUrl
        });
    } catch (error) {
        console.error('Error setting up MFA:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const POST = withAuth(handler);
