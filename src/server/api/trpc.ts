/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "~/server/db";
import { lucia, validateRequest } from "../auth";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
	return {
		db,
		...opts,
		user: null,
		session: null,
	};
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API.
 */
export const publicProcedure = t.procedure;

/**
 * Authenticated procedure
 *
 * This procedure requires a user to be signed in and provides the user and session data in the context of your handler
 */
export const authenticatedProcedure = publicProcedure.use(async ({ next }) => {
	const result = await validateRequest();

	if (!result.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Please sign in",
		});
	}

	return next({
		ctx: {
			user: result.user,
			session: result.session,
		},
	});
});

/**
 * Subscribed procedure
 *
 * This procedure requires a user to be signed in and have an active membership
 */
export const subscribedProcedure = authenticatedProcedure.use(async ({ ctx, next }) => {
	if (!ctx.user.membershipId) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You need to subscribe to access this feature",
		});
	}

	return next();
});
