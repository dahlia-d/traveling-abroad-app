import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import prisma from '../prisma/client';
import { TRPCError } from '@trpc/server';

export const refreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        throw new TRPCError({ code: 'FORBIDDEN' });
    }

    const refreshToken: string = cookies.jwt;

    const user = await prisma.user.findUnique({
        where: {
            refresh_token: refreshToken,
        }
    });

    if (!user) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Invalid token' });
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        (err, docoded) => {
            if (err) new TRPCError({ code: 'FORBIDDEN', message: 'Invalid token' });
            const accessToken = jwt.sign(
                { subject: user.id.toString() },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: '2h' }
            );
            res.cookie('jwt_access', accessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        }
    );
}