import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import prisma from '../prisma/client';
import { TRPCError } from '@trpc/server';
import { Response } from 'express';

export const authenticateUser = async (name: string, password: string, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {
            username: name,
        },
    });

    if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'There is no user with that username!' });
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Wrong password!' });
    }

    const accessToken = jwt.sign(
        { "username": user.username },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: '2h' }
    );

    const refreshToken = jwt.sign(
        { "username": user.username },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: '60d' }
    );

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            refresh_token: refreshToken,
        }
    });

    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.cookie('jwt_access', accessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
}