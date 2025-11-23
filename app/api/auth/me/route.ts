import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { withAuth, AuthenticatedRequest, errorHandler } from '@/lib/middleware';

async function handler(req: AuthenticatedRequest) {
    try {
        await dbConnect();

        const user = await User.findById(req.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                preferences: user.preferences,
                mfaEnabled: user.mfaEnabled,
                createdAt: user.createdAt,
            },
        });
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const GET = withAuth(handler);
