import { initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { verifyJWT } from '../middleware/verifyJWT';
import { ZodError } from 'zod';

// created for each request
export const createContext = async ({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) => {

	const user = await verifyJWT(req);

	return {
		req,
		res,
		user
	}
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
	errorFormatter(opts) { //?????
		const { shape, error } = opts;

		console.log("ERROR caught: ", { shape, error });

		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		};
	},
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
	async function isAuthed(opts) {
		const { ctx } = opts;
		if (!ctx.user) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return opts.next({
			ctx: {
				user: ctx.user,
			},
		});
	},
)