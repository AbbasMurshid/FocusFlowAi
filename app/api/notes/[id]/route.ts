import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/Note';
import { withAuth, AuthenticatedRequest, errorHandler } from '@/lib/middleware';

// PATCH update note
async function patchHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const { id } = params;
        const updates = await req.json();

        const note = await Note.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Note updated', note });
    } catch (error: any) {
        return errorHandler(error);
    }
}

// DELETE note
async function deleteHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const { id } = params;

        const note = await Note.findOneAndDelete({ _id: id, userId: req.userId });

        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Note deleted successfully' });
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
