import { getFilters, getPost, getPosts, getUserPosts, publishPost } from '../../controllers/postsController';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { z } from 'zod';

export const postsRouter = router({
    createPost: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                content: z.string(),
                categories: z.array(
                    z.object({
                        id: z.number()
                    })
                ).optional(),
                countries: z.array(
                    z.object({
                        id: z.number()
                    })
                ).optional()
            })
        )
        .mutation(async ({ input, ctx }) => {
            await publishPost(input.title, input.content, ctx.user.id, input.categories, input.countries);
        }),
    getUserPosts: protectedProcedure
        .mutation(async ({ ctx }) => {
            return await getUserPosts(ctx.user.id);
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
                    })
                ),
                countries: z.array(
                    z.object({
                        id: z.number(),
                    }),
                ),
                cursor: z.number().nullish()
            }))
        .query(async ({ input }) => {
            return await getPosts(input.categories, input.countries, input.cursor);
        }),
    getPost: publicProcedure
        .input(
            z.object({
                postId: z.number()
            })
        )
        .query(async ({ input }) => {
            return await getPost(input.postId)
        })
}); 