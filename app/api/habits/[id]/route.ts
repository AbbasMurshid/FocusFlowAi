import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Habit from '@/models/Habit';
import User from '@/models/User';
import { withAuth, AuthenticatedRequest, errorHandler } from '@/lib/middleware';

// PATCH update habit
async function patchHandler(
    req: AuthenticatedRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;
        const updates = await req.json();

        const habit = await Habit.findOne({ _id: id, userId: req.userId });

        if (!habit) {
            return NextResponse.json(
                { error: 'Habit not found' },
                { status: 404 }
            );
        }

        // Handle completion logic
        if (updates.completedDate) {
            const date = new Date(updates.completedDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Check if already completed today
            const alreadyCompleted = habit.completedDates.some((d: Date) => {
                const completed = new Date(d);
                completed.setHours(0, 0, 0, 0);
                return completed.getTime() === date.getTime();
            });

            if (!alreadyCompleted) {
                habit.completedDates.push(date);
                habit.streak += 1;

                // Award XP to user
                await User.findByIdAndUpdate(req.userId, {
                    $inc: { xp: 10 } // 10 XP per habit completion
                });
            }
        } else {
            // Regular update
            Object.assign(habit, updates);
        }

        await habit.save();

        return NextResponse.json({ habit });
    } catch (error: any) {
        return errorHandler(error);
    }
}

// DELETE (archive) habit
async function deleteHandler(
    req: AuthenticatedRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        const habit = await Habit.findOne({ _id: id, userId: req.userId });

        if (!habit) {
            return NextResponse.json(
                { error: 'Habit not found' },
                { status: 404 }
            );
        }

        // Soft delete (archive)
        habit.archived = true;
        await habit.save();

        return NextResponse.json({ message: 'Habit archived successfully' });
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
