import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/mail';
import { errorHandler } from '@/lib/middleware';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { email, password, name } = await req.json();

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists with this email' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            verificationCode,
            verificationCodeExpires,
            isVerified: false,
        });

        // Send verification email
        await sendVerificationEmail(email, verificationCode);

        return NextResponse.json(
            {
                message: 'Registration successful. Please verify your email.',
                userId: user._id,
                email: user.email,
                requiresVerification: true
            },
            { status: 201 }
        );
    } catch (error: any) {
        return errorHandler(error);
    }
}
