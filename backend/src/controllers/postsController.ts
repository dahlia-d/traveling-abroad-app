import {Request, Response} from 'express';
import prisma from '../prisma/client';
import { TRPCError } from '@trpc/server';

export const getUserPosts = (req: Request, res: Response) => {
    //TODO
    console.log('User posts');
    res.send('User posts');
};

export const publishPost = async (title: string, content: string, username: string) => {
    console.log(title, content);
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        }
    });

    if(user){
        console.log(user)
        console.log(user.username, user.id);
        const newPost = await prisma.post.create({
            data: {
                title: title,
                createdAt: new Date(),
                content: content,
                authorId: user.id
            }
        });    
        console.log('Published: ', newPost.title);
    }
    else {
        console.log('User not found!')
        return null;
    }
};