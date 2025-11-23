import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FocusSession from '@/models/FocusSession';
import { withAuth, AuthenticatedRequest, errorHandler } from '@/lib/middleware';

// GET all focus sessions
async function getHandler(req: AuthenticatedRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50');

        const sessions = await FocusSession.find({ userId: req.userId })
            .sort({ startedAt: -1 })
            .limit(limit)
            .populate('taskId', 'title');

        return NextResponse.json({ sessions });
    } catch (error: any) {
        return errorHandler(error);
    }
}

// POST create focus session
async function postHandler(req: AuthenticatedRequest) {
    try {
        await dbConnect();

        const { taskId, duration, type } = await req.json();

        if (!duration || !type) {
            return NextResponse.json(
                { error: 'Duration and type are required' },
                { status: 400 }
            );
        }

        const session = await FocusSession.create({
            userId: req.userId,
            taskId: taskId || null,
            duration,
            type,
            startedAt: new Date(),
        });

        return NextResponse.json(
            { message: 'Focus session started', session },
            { status: 201 }
        );
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
