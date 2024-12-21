import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from '.';
import { createContext } from './trpc';

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
	router: appRouter,
	createContext,
})