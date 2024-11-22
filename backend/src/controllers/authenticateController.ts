import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const prisma = new PrismaClient();

export const authenticateUser = async (req: Request, res: Response) => {
    try {
        const {name, password} : {name : string, password : string} = req.body;

        const user = await prisma.user.findUnique({
            where: {
                username : name,
            },
        })

        if(user){
            const result = await bcrypt.compare(password, user.password);

            if(result) {
                const accessToken = jwt.sign(
                    {"username": user.username},
                    process.env.ACCESS_TOKEN_SECRET!,
                    {expiresIn: '1m'}
                );

                const refreshToken = jwt.sign(
                    {"username": user.username},
                    process.env.REFRESH_TOKEN_SECRET!,
                    {expiresIn: '5d'}
                );

               await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    refresh_token: refreshToken,
                }
               });

                console.log('The user is authenticated!');
                res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
                res.json({ accessToken });
                //res.status(201).send('The user is authenticated!');
            }
            else { 
                console.log('Wrong password!');
                res.status(400).send('Wrong password!');
            }
        }
        else {
            console.log('There is no user with that username!');
            res.status(400).send('There is no user with that username!');
        }
    } catch (err) {
        console.error('Error authenticating user: ', err);
        res.status(500).send('Internal server error');
    }
}