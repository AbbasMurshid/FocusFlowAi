import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { withAuth, AuthenticatedRequest, errorHandler } from '@/lib/middleware';

// GET all tasks for user
async function getHandler(req: AuthenticatedRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');

        const query: any = { userId: req.userId };
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ tasks });
    } catch (error: any) {
        return errorHandler(error);
    }
}

// POST create new task
async function postHandler(req: AuthenticatedRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { title, description, priority, deadline, tags, estimatedTime } = body;

        if (!title) {
            return NextResponse.json(
                { error: 'Task title is required' },
                { status: 400 }
            );
        }

        const task = await Task.create({
            userId: req.userId,
            title,
            description: description || '',
            priority: priority || 'medium',
            deadline: deadline || null,
            tags: tags || [],
            estimatedTime: estimatedTime || 0,
        });

        return NextResponse.json(
            { message: 'Task created successfully', task },
            { status: 201 }
        );
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
