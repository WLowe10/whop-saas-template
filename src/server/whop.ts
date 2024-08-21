import { WhopAPI } from "@whop-apps/sdk";
import { env } from "~/env";

export const whop = WhopAPI.company({
	apiKey: env.WHOP_API_KEY,
});

/**
 * helper to create a usersdk from their access token
 * @param token access token
 * @returns user sdk
 */
export function getUserSdk(token: string) {
	return WhopAPI.me({
		token,
	});
}
