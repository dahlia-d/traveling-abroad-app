import { Request, Response } from 'express';
import 'dotenv/config';
import prisma from '../prisma/client';
import { TRPCError } from '@trpc/server';

export const logout = async (req: Request, res: Response) => {
    try{
        const cookies = req.cookies;
        if(!cookies?.jwt) throw new TRPCError({ code: 'FORBIDDEN' });

        const refreshToken = cookies.jwt;

        const user = await prisma.user.findUnique({
            where: {
                refresh_token : refreshToken,
            }
        });

        if(user){
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    refresh_token: null,
                }
            })

            console.log(user.refresh_token);

            res.clearCookie('jwt', { httpOnly: true });
        }
        else {
            res.clearCookie('jwt', { httpOnly: true });
        }
    } catch (err) {
        console.error(err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error'});
    }
}