import Link from "next/link";
import { redirect } from "next/navigation";
import { IconArrowLeft, IconTerminal } from "@tabler/icons-react";
import { validateRequest } from "~/server/auth";
import { getCheckoutUrl, getManageUrl } from "~/lib/utils";
import { env } from "~/env";
import { SignOutButton } from "~/components/sign-out-button";
import { AuthenticatedMessage, SubscribedMessage } from "~/components/messages";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";

export default async function DashboardPage() {
	const { user } = await validateRequest();

	if (!user) {
		return redirect("/");
	}

	return (
		<div className="min-h-screen flex p-6">
			<Button variant="link" className="group" asChild>
				<Link href="/" className="gap-2">
					<IconArrowLeft
						className="transition-[transform,opacity] opacity-50 group-hover:opacity-100 group-hover:-translate-x-1"
						size={20}
					/>
					<span>Go back</span>
				</Link>
			</Button>
			<div className="flex flex-1 justify-center items-center">
				<Card className="min-w-[450px]">
					<CardHeader>
						<div className="flex items-center">
							<Avatar className="mr-3">
								<AvatarImage src={user.avatarUrl || ""} />
								<AvatarFallback>{user.username.substring(0, 1)}</AvatarFallback>
							</Avatar>
							<div>
								<CardTitle>Dashboard</CardTitle>
								<CardDescription>Welcome back, {user.username}.</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{user.membershipId ? (
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-2">
									<p>You're subscribed to</p>
									<Badge variant="outline">{user.productId}</Badge>
								</div>
								<SubscribedMessage />
							</div>
						) : (
							<div className="flex flex-col gap-2">
								<Alert>
									<IconTerminal />
									<AlertTitle>Alert</AlertTitle>
									<AlertDescription>
										You need to be subscribed to have access to paid features.
									</AlertDescription>
								</Alert>
								<AuthenticatedMessage />
							</div>
						)}
					</CardContent>
					<CardFooter className="grid grid-cols-2 gap-2">
						<Button asChild>
							{user.membershipId ? (
								<a href={getManageUrl(user.membershipId)}>Manage</a>
							) : (
								<a href={getCheckoutUrl(env.NEXT_PUBLIC_PLAN_ID)}>Buy now</a>
							)}
						</Button>
						<SignOutButton className="w-full" />
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
