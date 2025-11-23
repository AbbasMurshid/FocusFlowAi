import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { errorHandler } from '@/lib/middleware';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Please provide email and verification code' },
                { status: 400 }
            );
        }

        // Find user with matching email and code, and check expiry
        const user = await User.findOne({
            email,
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired verification code' },
                { status: 400 }
            );
        }

        // Verify user and clear code
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        // Generate token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        // Return user data and token
        const response = NextResponse.json(
            {
                message: 'Email verified successfully',
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    preferences: user.preferences,
                },
                token,
            },
            { status: 200 }
        );

        // Set token in cookie
        response.cookies.set('token', token, {
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
