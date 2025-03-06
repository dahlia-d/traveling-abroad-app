import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { TRPCError } from '@trpc/server';

export const logout = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) throw new TRPCError({ code: 'FORBIDDEN' });

    const refreshToken = cookies.jwt;

    let user = await prisma.user.findUnique({
        where: {
            refresh_token: refreshToken,
        }
    });

    if (!user) {
        res.clearCookie('jwt_access', { httpOnly: true });
        res.clearCookie('jwt', { httpOnly: true });
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    user = await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            refresh_token: null,
        }
    })

    res.clearCookie('jwt_access', { httpOnly: true });
    res.clearCookie('jwt', { httpOnly: true });
}