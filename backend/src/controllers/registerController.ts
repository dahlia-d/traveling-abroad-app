import bcrypt from 'bcrypt';
import 'dotenv/config';
import prisma from '../prisma/client';
import { TRPCError } from '@trpc/server';


export const registerUser = async (name: string, password: string) => {
    let user = await prisma.user.findUnique({
        where: {
            username: name
        },
    });

    if (user) {
        throw new TRPCError({ code: 'CONFLICT', message: 'User with this name already exist!' });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await prisma.user.create({
        data: {
            username: name,
            password: hashedPassword
        }
    });

    return user;
}