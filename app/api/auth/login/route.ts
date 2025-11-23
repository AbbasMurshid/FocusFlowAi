import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';
import { errorHandler } from '@/lib/middleware';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { email, password } = await req.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Please provide email and password' },
                { status: 400 }
            );
        }

        // Find user (include password field)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if email is verified
        if (!user.isVerified) {
            return NextResponse.json(
                {
                    error: 'Please verify your email address',
                    requiresVerification: true,
                    email: user.email
                },
                { status: 403 }
            );
        }

        // Check if MFA is enabled
        if (user.mfaEnabled) {
            return NextResponse.json({
                mfaRequired: true,
                userId: user._id,
                message: 'MFA verification required'
            });
        }

        // Generate token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        // Return user data (without password) and token
        const response = NextResponse.json(
            {
                message: 'Login successful',
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
