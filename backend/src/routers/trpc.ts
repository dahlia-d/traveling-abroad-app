import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { verifyJWT } from "../middleware/verifyJWT";
import { ZodError } from "zod";
import prisma from "../prisma/client";
import { User } from "@prisma/client";
import superjson from 'superjson';

export const createContext = async ({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) => {
	const username = await verifyJWT(req);
	let user: User | null = null;
	if (username) {
		user = await prisma.user.findUnique({
			where: {
				username: username
			}
		});
	}

	return {
		req,
		res,
		user,
	};
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
	errorFormatter(opts) {
		const { shape, error } = opts;


		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.code === "BAD_REQUEST" && error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		};
	},
	transformer: superjson
});

export const router = t.router;
export const { createCallerFactory } = t;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
	async function isAuthed(opts) {
		const { ctx } = opts;
		
		if (!ctx.user) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}

		return opts.next({
			ctx: {
				user: ctx.user,
			},
		});
	}
);
