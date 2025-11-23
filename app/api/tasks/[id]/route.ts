import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { withAuth, AuthenticatedRequest, errorHandler } from '@/lib/middleware';

// GET single task
async function getHandler(
    req: AuthenticatedRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const task = await Task.findOne({ _id: params.id, userId: req.userId });

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ task });
    } catch (error: any) {
        return errorHandler(error);
    }
}

// PATCH update task
async function patchHandler(
    req: AuthenticatedRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const body = await req.json();

        const task = await Task.findOneAndUpdate(
            { _id: params.id, userId: req.userId },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Task updated successfully', task });
    } catch (error: any) {
        return errorHandler(error);
    }
}

// DELETE task
async function deleteHandler(
    req: AuthenticatedRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const task = await Task.findOneAndDelete({
            _id: params.id,
            userId: req.userId,
        });

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
