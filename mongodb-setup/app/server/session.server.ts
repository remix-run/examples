import * as dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import type { LoginForm } from '~/types';
import { UserApi } from '~/user/api';

const sessionSecret = process.env.COOKIE_SECRET;
const userService = new UserApi();

if (!sessionSecret) {
    throw new Error('COOKIE_SECRET must be set');
}

const storage = createCookieSessionStorage({
    cookie: {
        name: process.env.COOKIE_NAME,
        secure: process.env.NODE_ENV === 'production',
        secrets: [sessionSecret],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true
    }
});
export async function createUserSession(id: string, email: string, redirectTo: string) {
    const session = await storage.getSession();
    session.set('id', id);
    session.set('email', email);
    return redirect(redirectTo, {
        headers: {
            'Set-Cookie': await storage.commitSession(session)
        }
    });
}
function getUserSession(request: Request) {
    return storage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
    const session = await getUserSession(request);
    const id = session.get('id');
    if (!id || typeof id !== 'string') return null;
    return id;
}

export async function getUserEmail(request: Request) {
    const session = await getUserSession(request);
    const email = session.get('email');
    if (!email || typeof email !== 'string') return null;
    return email;
}

export async function requireUserId(request: Request) {
    const session = await getUserSession(request);
    const id = session.get('id');
    if (!id || typeof id !== 'string') {
        throw redirect(`/login`);
    }
    return id;
}

export async function login({ username, password }: LoginForm) {
    const user = await userService.getUserByEmail(username);
    console.log('Usuario', user);
    if (!user) return null;
    const isCorrectPassword = await bcrypt.compare(password, user.password!);
    if (!isCorrectPassword) return null;
    return user;
}

export async function logout(request: Request) {
    const session = await getUserSession(request);
    return redirect('/login', {
        headers: {
            'Set-Cookie': await storage.destroySession(session)
        }
    });
}
