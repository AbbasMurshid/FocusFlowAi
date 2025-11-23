import mongoose, { Document, Schema } from 'mongoose';

export interface IFocusSession extends Document {
    userId: mongoose.Types.ObjectId;
    taskId?: mongoose.Types.ObjectId;
    duration: number; // in minutes
    completedDuration: number; // actual time focused
    type: 'focus' | 'short-break' | 'long-break';
    startedAt: Date;
    completedAt?: Date;
    interrupted: boolean;
    createdAt: Date;
}

const FocusSessionSchema = new Schema<IFocusSession>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        taskId: {
            type: Schema.Types.ObjectId,
            ref: 'Task',
            default: null,
        },
        duration: {
            type: Number,
            required: true,
        },
        completedDuration: {
            type: Number,
            default: 0,
        },
        type: {
            type: String,
            enum: ['focus', 'short-break', 'long-break'],
            required: true,
        },
        startedAt: {
            type: Date,
            required: true,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        interrupted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.FocusSession || mongoose.model<IFocusSession>('FocusSession', FocusSessionSchema);
