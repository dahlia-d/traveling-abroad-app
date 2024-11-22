import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const prisma = new PrismaClient(); 

export const refreshToken = async (req : Request, res : Response) => {
    try {
        const cookies = req.cookies;
        if(!cookies?.jwt) {
            res.sendStatus(401);
            return;
        }

        const refreshToken : string = cookies.jwt;
        console.log({'Refresh token: ': refreshToken})

        const user = await prisma.user.findUnique({
            where: {
                refresh_token: refreshToken,
            }
        });

        if(user) {
            jwt.verify(
                refreshToken, 
                process.env.REFRESH_TOKEN_SECRET!, 
                (err, docoded) => {
                    if(err) res.status(402).send('Invalid token');
                    const accessToken = jwt.sign(
                        { 'username' : user.username }, 
                        process.env.ACCESS_TOKEN_SECRET!, 
                        {expiresIn: '1m'}
                    );
                    console.log('New access token');
                    res.json({ accessToken });
                }
            );
        } 
        else {
            res.status(403).send('Invalid token');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal srever error!');
    }  

}