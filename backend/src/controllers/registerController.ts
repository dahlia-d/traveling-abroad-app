import bcrypt from 'bcrypt';
import 'dotenv/config';
import prisma from '../prisma/client';
import { TRPCError } from '@trpc/server';


export const registerUser = async (name: string, password: string) => { 
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: name
            },
        });

        if(!user){
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            
            await prisma.user.create({
                data: {
                    username: name,
                    password: hashedPassword
                }
            });
            
            console.log('New user is registered!');
        }
        else {
            console.log('User with this name already exist!');
            throw new TRPCError({ code: 'CONFLICT', message: 'User with this name already exist!' });
        }
    } catch (err) {
        console.error('Error registering user: ', err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error'});
    }
}