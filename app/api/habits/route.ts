import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Habit from '@/models/Habit';
import { withAuth, AuthenticatedRequest, errorHandler } from '@/lib/middleware';

// GET all habits for user
async function getHandler(req: AuthenticatedRequest) {
    try {
        await dbConnect();

        const habits = await Habit.find({
            userId: req.userId,
            archived: false,
        }).sort({ createdAt: -1 });

        return NextResponse.json({ habits });
    } catch (error: any) {
        return errorHandler(error);
    }
}

// POST create new habit
async function postHandler(req: AuthenticatedRequest) {
    try {
        await dbConnect();

        const { title, description, frequency, customDays, reminderTime, category } = await req.json();

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const habit = await Habit.create({
            userId: req.userId,
            title,
            description,
            frequency,
            customDays,
            reminderTime,
            category,
        });

        return NextResponse.json({ habit }, { status: 201 });
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
