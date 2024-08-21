import { db } from "~/server/db";
import { makeWebhookHandler } from "@whop-apps/sdk";
import { env } from "~/env";
import { whop } from "~/server/whop";
import type { NextRequest } from "next/server";

/*
This API route is used to handle webhooks from Whop.
Learn more: https://dev.whop.com/sdk/webhooks
*/

const handleWebhook = makeWebhookHandler({
	signatureKey: env.WHOP_WEBHOOK_SECRET,
});

export async function POST(req: NextRequest) {
	return handleWebhook(req, {
		membershipWentValid: async ({ data }) => {
			const user = await db.user.findFirst({
				where: {
					whopId: data.user_id!,
				},
			});

			if (user) {
				await db.user.update({
					where: {
						whopId: data.user_id,
					},
					data: {
						membershipId: data.id,
						productId: data.product_id,
						planId: data.plan_id,
					},
				});
			} else {
				// if the user doesn't exist, they subscribed on whop first before signing in on our app

				const result = await whop.GET("/company/users/{id}", {
					params: {
						path: {
							id: data.user_id!,
						},
					},
				});

				if (result.isErr) {
					throw new Error("Failed to fetch user data");
				}

				const profile = result.data;

				await db.user.create({
					data: {
						whopId: profile.id,
						username: profile.username,
						email: profile.email!,
						avatarUrl: profile.profile_pic_url,
						membershipId: data.id,
						productId: data.product_id,
						planId: data.plan_id,
					},
				});
			}
		},
		membershipWentInvalid: async ({ data }) => {
			await db.user.update({
				where: {
					membershipId: data.id,
					whopId: data.user_id,
				},
				data: {
					membershipId: null,
					productId: null,
					planId: null,
				},
			});
		},
	});
}
