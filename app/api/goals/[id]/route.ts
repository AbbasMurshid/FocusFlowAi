import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Goal from '@/models/Goal';
import { withAuth, AuthenticatedRequest, errorHandler } from '@/lib/middleware';

// PATCH update goal (e.g., toggle milestone)
async function patchHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const { id } = params;
        const updates = await req.json();

        // Get existing goal to calculate progress
        const existingGoal = await Goal.findOne({ _id: id, userId: req.userId });
        if (!existingGoal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        // Calculate progress based on multiple factors
        let calculatedProgress = 0;

        // If milestones are being updated, calculate based on milestone completion
        const milestonesToUse = updates.milestones || existingGoal.milestones;
        if (milestonesToUse && milestonesToUse.length > 0) {
            const total = milestonesToUse.length;
            const completed = milestonesToUse.filter((m: any) => m.completed).length;
            const milestoneProgress = total > 0 ? (completed / total) * 100 : 0;

            // Calculate time-based progress
            const startDate = new Date(existingGoal.createdAt).getTime();
            const targetDate = new Date(updates.targetDate || existingGoal.targetDate).getTime();
            const now = Date.now();
            const totalTime = targetDate - startDate;
            const elapsedTime = now - startDate;
            const timeProgress = totalTime > 0 ? Math.min((elapsedTime / totalTime) * 100, 100) : 0;

            // Weighted average: 70% milestones, 30% time
            calculatedProgress = Math.round((milestoneProgress * 0.7) + (timeProgress * 0.3));
        } else {
            // No milestones: use pure time-based progress
            const startDate = new Date(existingGoal.createdAt).getTime();
            const targetDate = new Date(updates.targetDate || existingGoal.targetDate).getTime();
            const now = Date.now();
            const totalTime = targetDate - startDate;
            const elapsedTime = now - startDate;
            calculatedProgress = totalTime > 0 ? Math.min(Math.round((elapsedTime / totalTime) * 100), 100) : 0;
        }

        updates.progress = Math.max(0, Math.min(100, calculatedProgress));

        const goal = await Goal.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Goal updated', goal });
    } catch (error: any) {
        return errorHandler(error);
    }
}

// DELETE goal
async function deleteHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const { id } = params;

        const goal = await Goal.findOneAndDelete({ _id: id, userId: req.userId });

        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Goal deleted successfully' });
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
