import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken, hashToken } from '@/lib/tokens';
import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY;

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            // Return success even if user not found to prevent enumeration
            return NextResponse.json({ message: 'If an account exists, an email has been sent.' });
        }

        // Generate reset token
        const resetToken = generateToken();
        const hashedToken = hashToken(resetToken);

        // Save hashed token to DB
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email via Brevo
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

        try {
            await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                {
                    sender: {
                        name: 'FocusFlow AI',
                        email: 'no-reply@focusflow.ai',
                    },
                    to: [{ email: user.email }],
                    subject: 'Reset your password',
                    htmlContent: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Reset your Password</h2>
                            <p>You requested a password reset. Click the link below to reset your password:</p>
                            <div style="margin: 20px 0;">
                                <a href="${resetUrl}" style="background: #6C5CE7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
                            </div>
                            <p>This link will expire in 1 hour.</p>
                            <p>If you didn't request this, please ignore this email.</p>
                        </div>
                    `,
                },
                {
                    headers: {
                        'accept': 'application/json',
                        'api-key': BREVO_API_KEY,
                        'content-type': 'application/json',
                    },
                }
            );
        } catch (emailError) {
            console.error('Failed to send reset email:', emailError);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ message: 'If an account exists, an email has been sent.' });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
