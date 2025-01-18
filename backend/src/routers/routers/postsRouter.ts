import { getFilters, getPosts, getUserPosts, publishPost } from '../../controllers/postsController';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { Country, Category } from '@prisma/client';

export const postsRouter = router({
    createPost: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                content: z.string(),
                categories: z.array(
                    z.object({
                        id: z.number(),
                        name: z.string()
                    })
                ).optional(),
                countries: z.array(
                    z.object({
                        id: z.number(),
                        name: z.string()
                    })
                ).optional()
            })
        )
        .mutation(async ({ input, ctx }) => {
            await publishPost(input.title, input.content, ctx.user.username, input.categories, input.countries);
        }),
    getUserPosts: protectedProcedure
        .mutation(async ({ ctx }) => {
            return await getUserPosts(ctx.user.username);
        }),
    getFilters: publicProcedure
        .query(async () => {
            return await getFilters();
        }),
    getPosts: publicProcedure
        .input(
            z.object({
                categories: z.array(
                    z.object({
                        id: z.number(),
                        name: z.string()
                    })
                ),
                countries: z.array(
                    z.object({
                        id: z.number(),
                        name: z.string()
                    })
                )
            }))
        .query(async ({ input }) => {
            return await getPosts(input.categories, input.countries);
        })
}); 