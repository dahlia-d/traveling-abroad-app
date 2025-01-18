import { publicProcedure, router } from "./trpc";
import { postsRouter } from "./routers/postsRouter";
import { authenticateRouter } from "./routers/authenticateRouter";
import { registerRouter } from "./routers/registerRouter";

export const appRouter = router({
	register: registerRouter,
	authenticate: authenticateRouter,
	posts: postsRouter,
});

export type AppRouter = typeof appRouter;
