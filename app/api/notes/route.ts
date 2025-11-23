import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/Note';
import { withAuth, AuthenticatedRequest, errorHandler } from '@/lib/middleware';

// GET all notes
async function getHandler(req: AuthenticatedRequest) {
    try {
        await dbConnect();

        const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ notes });
    } catch (error: any) {
        return errorHandler(error);
    }
}

// POST create note
async function postHandler(req: AuthenticatedRequest) {
    try {
        await dbConnect();

        const { title, content, tags } = await req.json();

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const note = await Note.create({
            userId: req.userId,
            title,
            content,
            tags: tags || [],
        });

        return NextResponse.json(
            { message: 'Note created successfully', note },
            { status: 201 }
        );
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
