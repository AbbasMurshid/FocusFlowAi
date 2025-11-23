import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Goal from '@/models/Goal';
import { withAuth, AuthenticatedRequest, errorHandler } from '@/lib/middleware';

// GET all goals
async function getHandler(req: AuthenticatedRequest) {
    try {
        await dbConnect();

        const goals = await Goal.find({ userId: req.userId }).sort({ targetDate: 1 });

        return NextResponse.json({ goals });
    } catch (error: any) {
        return errorHandler(error);
    }
}

// POST create goal
async function postHandler(req: AuthenticatedRequest) {
    try {
        await dbConnect();

        const { title, description, targetDate, category, milestones } = await req.json();

        if (!title || !targetDate) {
            return NextResponse.json(
                { error: 'Title and target date are required' },
                { status: 400 }
            );
        }

        const goal = await Goal.create({
            userId: req.userId,
            title,
            description: description || '',
            targetDate,
            category: category || 'general',
            milestones: milestones || [],
        });

        return NextResponse.json(
            { message: 'Goal created successfully', goal },
            { status: 201 }
        );
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
