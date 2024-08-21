import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { lucia, whopOAuth2Client } from "~/server/auth";
import { env } from "~/env";
import { db } from "~/server/db";
import { getUserSdk } from "~/server/whop";

export async function GET(request: Request) {
	const cookieStore = cookies();

	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const cookieState = cookieStore.get("state");

	if (!code || !state || !cookieState || state !== cookieState.value) {
		return NextResponse.redirect(env.APP_URL);
	}

	const tokens = await whopOAuth2Client.validateAuthorizationCode(code, {
		credentials: env.WHOP_CLIENT_SECRET,
	});

	const sdk = getUserSdk(tokens.access_token);
	const result = await sdk.GET("/me", {});

	if (result.isErr) {
		return NextResponse.redirect(env.APP_URL);
	}

	const profile = result.data;

	let user = await db.user.findFirst({
		where: {
			whopId: profile.id,
		},
	});

	// if the user doesn't exist, create a new user
	if (!user) {
		user = await db.user.create({
			data: {
				whopId: profile.id,
				username: profile.username,
				email: profile.email!,
				avatarUrl: profile.profile_pic_url,
			},
		});
	}

	// create a new session
	const session = await lucia.createSession(user.id, {});
	const sessionCookie = await lucia.createSessionCookie(session.id);

	cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	// redirect the user to the dashboard
	return NextResponse.redirect(new URL("/dashboard", env.APP_URL));
}
