import { cookies } from "next/headers";
import { generateState } from "oslo/oauth2";
import { env } from "~/env";
import { validateRequest, whopOAuth2Client } from "~/server/auth";

export async function GET() {
	const auth = await validateRequest();

	// the user is already authenticated, redirect them to the homepage
	if (auth.session) {
		return Response.redirect(env.APP_URL);
	}

	const cookieStore = cookies();
	const state = generateState();

	const authorizationUrl = await whopOAuth2Client.createAuthorizationURL({
		state,
	});

	cookieStore.set("state", state, {
		path: "/",
		secure: env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	});

	return Response.redirect(authorizationUrl);
}
