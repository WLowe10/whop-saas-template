import { cookies } from "next/headers";
import { lucia } from "~/server/auth";
import { authenticatedProcedure, createTRPCRouter } from "../trpc";

export const authRouter = createTRPCRouter({
	signOut: authenticatedProcedure.mutation(async ({ ctx }) => {
		await lucia.invalidateSession(ctx.session.id);

		// send the user a blank cookie to clear the session
		const cookie = lucia.createBlankSessionCookie();

		cookies().set(cookie.name, cookie.value, cookie.attributes);
	}),
});
