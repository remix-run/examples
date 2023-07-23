import 'dotenv/config';
import mongoose, { Schema } from 'mongoose';

import type { UserModel } from '~/types';

let db: any;

connect();

async function connect() {
    try {
        if (!process.env.MONGODB_URL) throw new Error('MONGODB_URL is required');

        if (process.env.NODE_ENV === 'production') {
            db = await mongoose.connect(process.env.MONGODB_URL);
        } else {
            if (!(global as any).__db) {
                (global as any).__db = await mongoose.connect(process.env.MONGODB_URL);
            }
            db = (global as any).__db;
        }
        return db;
    } catch (error: any) {
        console.error('--- ERROR', error);
    }
}

// Users
const UserSchema = new Schema<UserModel>({
    email: { type: String, required: true },
    password: { type: String }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export { mongoose, connect, User };
