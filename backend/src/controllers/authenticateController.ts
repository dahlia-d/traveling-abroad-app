import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import prisma from '../prisma/client';
import { TRPCError } from '@trpc/server';

export const authenticateUser = async (name: string, password: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username : name,
            },
        });

        if (user) {
            const result = await bcrypt.compare(password, user.password);

            if(result) {
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

                console.log('The user is authenticated!');
                return { accessToken, refreshToken };
            }
            else { 
                console.log('Wrong password!');
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Wrong password' }); 
            }
        }
        else {
            console.log('There is no user with that username!');
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'There is no user with that username!' });
        }
    } catch (err) {
        console.error('Error authenticating user: ', err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error'});
    }
}