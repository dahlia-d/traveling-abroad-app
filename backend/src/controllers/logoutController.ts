import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

export const logout = async (req: Request, res: Response) => {
    try{
        const cookies = req.cookies;
        if(!cookies?.jwt) res.sendStatus(204);

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

            res.clearCookie('jwt', { httpOnly: true })
            res.sendStatus(204);
        }
        else {
            res.clearCookie('jwt', { httpOnly: true })
            res.sendStatus(204);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}