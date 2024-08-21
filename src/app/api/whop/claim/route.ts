import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "~/env";
import { db } from "~/server/db";
import { lucia, validateRequest, whopOAuth2ClaimClient, whopOAuth2Client } from "~/server/auth";
import { getUserSdk } from "~/server/whop";

/* 
Whop web apps allow the user to access the your web app through your hub. 
When doing this, Whop sends an OAuth code to this route skipping the need for the user to sign in on your web app.
*/

export async function GET(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");

	if (!code) {
		return NextResponse.redirect(env.APP_URL);
	}

	const existingSession = await validateRequest();

	if (existingSession.session) {
		return NextResponse.redirect(new URL("/dashboard", env.APP_URL));
	}

	const tokens = await whopOAuth2ClaimClient.validateAuthorizationCode(code, {
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

	const cookieStore = cookies();

	// create a new session
	const session = await lucia.createSession(user.id, {});
	const sessionCookie = await lucia.createSessionCookie(session.id);

	cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	// redirect the user to the dashboard
	return NextResponse.redirect(new URL("/dashboard", env.APP_URL));
}
