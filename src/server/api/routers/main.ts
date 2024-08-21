import { z } from "zod";
import {
	authenticatedProcedure,
	createTRPCRouter,
	publicProcedure,
	subscribedProcedure,
} from "~/server/api/trpc";

export const mainRouter = createTRPCRouter({
	hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
		return {
			greeting: `Hello ${input.text}`,
		};
	}),
	getAuthenticatedMessage: authenticatedProcedure.query(({ ctx }) => {
		// you can use authenticated procedures to require a user to be authenticated

		// use ctx.user to access the authenticated user
		console.log(`${ctx.user.username} has seen the authenticated message`);

		return {
			message: `Only authenticated users can see this message.`,
		};
	}),
	getSubscribedMessage: subscribedProcedure.query(({ ctx }) => {
		// you can use subscribed procedures to require a user to have an active membership
		console.log(`${ctx.user.username} has seen the paywalled message`);

		return {
			message: `Only subscribed users can see this message.`,
		};
	}),
});
