import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import prisma from '../prisma/client';
import { TRPCError } from '@trpc/server';

export const refreshToken = async (req: Request) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            throw new TRPCError({ code: 'FORBIDDEN' });
        }

        const refreshToken: string = cookies.jwt;
        console.log({ 'Refresh token: ': refreshToken })

        const user = await prisma.user.findUnique({
            where: {
                refresh_token: refreshToken,
            }
        });

        if (user) {
            return new Promise((resolve, reject) => {
                jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET!,
                    (err, docoded) => {
                        if (err) reject(new TRPCError({ code: 'FORBIDDEN', message: 'Invalid token' }));
                        const accessToken = jwt.sign(
                            { 'username': user.username },
                            process.env.ACCESS_TOKEN_SECRET!,
                            { expiresIn: '2h' }
                        );
                        resolve(accessToken);
                    }
                );
            });
        }
        else {
            new TRPCError({ code: 'FORBIDDEN', message: 'Invalid token' });
        }
    } catch (err) {
        console.error(err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
    }

}