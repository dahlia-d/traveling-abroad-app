import { publishPost } from '../../controllers/postsController';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { z } from 'zod';

export const postsRouter = router({
    createPost: protectedProcedure //TODO - authorize procedure
        .input(
            z.object({
                title: z.string(),
                content: z.string()
            })
        )
        .mutation(async ({input, ctx}) => {
            await publishPost(input.title, input.content, ctx.user.username);
        })
}); 