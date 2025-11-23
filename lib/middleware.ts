import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
    userId?: string;
    userEmail?: string;
}

export const withAuth = (
    handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>
) => {
    return async (req: AuthenticatedRequest, ...args: any[]) => {
        try {
            // Get token from Authorization header or cookies
            const authHeader = req.headers.get('authorization');
            const token = authHeader?.replace('Bearer ', '') || req.cookies.get('token')?.value;

            if (!token) {
                return NextResponse.json(
                    { error: 'Authentication required' },
                    { status: 401 }
                );
            }

            // Verify token
            const decoded = verifyToken(token);
            if (!decoded) {
                return NextResponse.json(
                    { error: 'Invalid or expired token' },
                    { status: 401 }
                );
            }

            // Attach user info to request
            req.userId = decoded.userId;
            req.userEmail = decoded.email;

            return handler(req, ...args);
        } catch (error) {
            return NextResponse.json(
                { error: 'Authentication failed' },
                { status: 401 }
            );
        }
    };
};

export const errorHandler = (error: any) => {
    console.error('API Error:', error);

    if (error.name === 'ValidationError') {
        return NextResponse.json(
            { error: 'Validation error', details: error.message },
            { status: 400 }
        );
    }

    if (error.code === 11000) {
        return NextResponse.json(
            { error: 'Duplicate entry', details: 'Resource already exists' },
            { status: 409 }
        );
    }

    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    );
};
