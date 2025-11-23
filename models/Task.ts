import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    deadline: Date | null;
    aiSuggestions: string[];
    tags: string[];
    estimatedTime: number; // in minutes
    actualTime: number; // in minutes
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a task title'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'completed'],
            default: 'todo',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        deadline: {
            type: Date,
            default: null,
        },
        aiSuggestions: [{
            type: String,
        }],
        tags: [{
            type: String,
        }],
        estimatedTime: {
            type: Number,
            default: 0,
        },
        actualTime: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
