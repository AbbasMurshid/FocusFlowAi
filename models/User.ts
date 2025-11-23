import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    preferences: {
        theme: string;
        notifications: boolean;
        focusDuration: number;
        breakDuration: number;
    };
    mfaSecret?: string;
    mfaEnabled: boolean;
    isVerified: boolean;
    verificationCode?: string;
    verificationCodeExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false,
        },
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        preferences: {
            theme: {
                type: String,
                default: 'dark',
            },
            notifications: {
                type: Boolean,
                default: true,
            },
            focusDuration: {
                type: Number,
                default: 25,
            },
            breakDuration: {
                type: Number,
                default: 5,
            },
        },
        mfaSecret: {
            type: String,
            select: false,
        },
        mfaEnabled: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
            select: false,
        },
        verificationCodeExpires: {
            type: Date,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
