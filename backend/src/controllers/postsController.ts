import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserPosts = (req: Request, res: Response) => {
    //TODO
    console.log('User posts');
    res.send('User posts');
};

export const publishPost = (req: Request, res: Response) => {
    //TODO
    console.log('Publish');
};