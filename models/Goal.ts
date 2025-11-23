import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    targetDate: Date;
    progress: number; // 0-100
    milestones: {
        title: string;
        completed: boolean;
        completedAt?: Date;
    }[];
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a goal title'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        targetDate: {
            type: Date,
            required: true,
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        milestones: [{
            title: String,
            completed: { type: Boolean, default: false },
            completedAt: Date,
        }],
        category: {
            type: String,
            default: 'general',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);
