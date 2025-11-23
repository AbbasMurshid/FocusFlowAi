import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { authenticator } from 'otplib';
import { errorHandler } from '@/lib/middleware';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { userId, token } = await req.json();

        if (!userId || !token) {
            return NextResponse.json(
                { error: 'Missing userId or token' },
                { status: 400 }
            );
        }

        const user = await User.findById(userId).select('+mfaSecret');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (!user.mfaEnabled || !user.mfaSecret) {
            return NextResponse.json(
                { error: 'MFA not enabled for this user' },
                { status: 400 }
            );
        }

        const isValid = authenticator.check(token, user.mfaSecret);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid MFA code' },
                { status: 401 }
            );
        }

        // Generate token
        const authToken = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        // Return user data and token
        const response = NextResponse.json(
            {
                message: 'Login successful',
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    preferences: user.preferences,
                },
                token: authToken,
            },
            { status: 200 }
        );

        // Set token in cookie
        response.cookies.set('token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error: any) {
        return errorHandler(error);
    }
}
