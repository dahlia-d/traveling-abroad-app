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
            const { accessToken, refreshToken }: { accessToken: string, refreshToken: string } = await authenticateUser(input.username, input.password);
            ctx.res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            ctx.res.cookie('jwt_access', accessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        }),

    logout: protectedProcedure
        .mutation(async ({ ctx }) => {
            logout(ctx.req, ctx.res);
        }),

    refresh: publicProcedure
        .mutation(async ({ ctx }) => {
            const accessToken = await refreshToken(ctx.req);
            ctx.res.cookie('jwt_access', accessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        })
});
