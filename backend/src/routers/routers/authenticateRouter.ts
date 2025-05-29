import { router, publicProcedure, protectedProcedure } from "../trpc";
import z from 'zod';
import { refreshToken } from "../../controllers/refreshTokenController";
import { authenticateUser } from "../../controllers/authenticateController";
import { logout } from '../../controllers/logoutController';

export const authenticateRouter = router({
    login: publicProcedure
        .input(
            z.object({
                username: z.string(),
                password: z.string()
            })
        )
        .mutation(async ({ input, ctx }) => {
            await authenticateUser(input.username, input.password, ctx.res);
        }),
    logout: protectedProcedure
        .mutation(async ({ ctx }) => {
            await logout(ctx.req, ctx.res);
        }),
    refresh: publicProcedure
        .mutation(async ({ ctx }) => {
            await refreshToken(ctx.req, ctx.res);
        }),
    getUser: publicProcedure
        .query(async ({ ctx }) => {
            return {
                id: ctx.user?.id,
                username: ctx.user?.username
            };
        })
});
