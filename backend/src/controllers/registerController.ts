import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const prisma = new PrismaClient();

export const registerUser = async (req : Request, res: Response) => {
    try {
    
        const {name, password} : {name: string, password: string} = req.body;

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

            res.status(201).send('New user is registered!');
            console.log('New user is registered!');
        }
        else {
            console.log('User with this name already exist!');
            res.status(400).send('User with this name already exist!');
        }

        //const allUsers = await  prisma.user.findMany();
        //console.dir(allUsers, {depth : null});

    } catch (err) {
        console.error('Error registering user: ', err);
        res.status(500).send('Internal server error');
    }
}