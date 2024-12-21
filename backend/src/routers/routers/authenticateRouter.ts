import { router, publicProcedure } from "../trpc";
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
        .mutation( async ({input, ctx}) => {
            const { accessToken, refreshToken } : { accessToken: string, refreshToken: string } = await authenticateUser(input.username, input.password);
            ctx.res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            ctx.res.cookie('jwt_access', accessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            //ctx.res.header(accessToken);// как да изпратя тъпия токе към фротеда с трпс
        }),

    logout: publicProcedure //TODO authorize procedure
        .mutation( async ({ctx}) => {
            logout(ctx.req, ctx.res);
        }),

    refresh: publicProcedure //TODO authorize procedure
        .mutation( async ({ctx}) => {
            refreshToken(ctx.req, ctx.res);
        })
});
