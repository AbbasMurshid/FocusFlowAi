import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    content: string;
    summary: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a note title'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Please provide note content'],
        },
        summary: {
            type: String,
            default: '',
        },
        tags: [{
            type: String,
        }],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
