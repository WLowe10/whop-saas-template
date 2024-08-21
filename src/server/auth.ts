import { cache } from "react";
import { cookies } from "next/headers";
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { OAuth2Client } from "oslo/oauth2";
import { env } from "~/env";
import { db } from "./db";
import type { User } from "@prisma/client";

export const lucia = new Lucia(new PrismaAdapter(db.session, db.user), {
	sessionCookie: {
		attributes: {
			secure: env.NODE_ENV === "production",
		},
	},
	getUserAttributes: (attributes) => ({
		whopId: attributes.whopId,
		email: attributes.email,
		username: attributes.username,
		avatarUrl: attributes.avatarUrl,
		membershipId: attributes.membershipId,
		productId: attributes.productId,
	}),
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Pick<
			User,
			"whopId" | "email" | "username" | "avatarUrl" | "membershipId" | "productId"
		>;
	}
}

const authorizeEndpoint = "https://whop.com/oauth";
const tokenEndpoint = "https://api.whop.com/api/v5/oauth/token";

export const whopOAuth2Client = new OAuth2Client(
	env.WHOP_CLIENT_ID,
	authorizeEndpoint,
	tokenEndpoint,
	{
		redirectURI: env.APP_URL + "/api/whop/callback",
	}
);

// this OAuth client is used only for the /api/whop/claim endpoint
export const whopOAuth2ClaimClient = new OAuth2Client(
	env.WHOP_CLIENT_ID,
	authorizeEndpoint,
	tokenEndpoint,
	{
		redirectURI: env.APP_URL + "/api/whop/claim",
	}
);

export const validateRequest = cache(async () => {
	const cookieStore = cookies();

	const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

	if (!sessionId) {
		return {
			user: null,
			session: null,
		};
	}

	const result = await lucia.validateSession(sessionId);

	// next.js throws when you attempt to set cookie when rendering page
	try {
		if (result.session && result.session.fresh) {
			const sessionCookie = lucia.createSessionCookie(result.session.id);

			cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
		if (!result.session) {
			const sessionCookie = lucia.createBlankSessionCookie();

			cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
	} catch {}

	return result;
});
