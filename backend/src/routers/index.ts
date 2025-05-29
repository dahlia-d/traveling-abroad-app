import { router } from "./trpc";
import { postsRouter } from "./routers/postsRouter";
import { authenticateRouter } from "./routers/authenticateRouter";
import { registerRouter } from "./routers/registerRouter";
import { checkpointsRouter } from './routers/checkpointsRouter';

export const appRouter = router({
	register: registerRouter,
	authenticate: authenticateRouter,
	posts: postsRouter,
	checkpoints: checkpointsRouter
});

export type AppRouter = typeof appRouter;