import Link from "next/link";
import { validateRequest } from "~/server/auth";
import { LinkCard } from "~/components/link-card";
import { IconWhop } from "~/components/icons/whop";
import { Button } from "~/components/ui/button";

export default async function HomePage() {
	const { user } = await validateRequest();

	return (
		<div className="mx-auto container">
			<div className="flex flex-col items-center gap-4 mb-16">
				<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
					<span>whop-saas-template</span>
				</h1>
				<p className="text-muted-foreground">
					A starter for building and monetizing your web app on Whop
				</p>
				<Button variant="outline" asChild>
					{user ? (
						<Link href="/dashboard">Dashboard</Link>
					) : (
						<a className="gap-2" href="/api/whop/sign-in">
							<IconWhop height={20} width={20} />
							<span>Sign up With Whop</span>
						</a>
					)}
				</Button>
			</div>
			<div className="flex flex-col items-center gap-6">
				<div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
					<LinkCard
						title="Whop"
						description="Whop for OAuth and subscriptions"
						href="https://whop.com"
						image="https://avatars.githubusercontent.com/u/91036480?s=200&v=4"
					/>
					<LinkCard
						title="NextJS"
						description="Nextjs as the web framework"
						href="https://nextjs.org"
						image="https://avatars.githubusercontent.com/u/14985020?s=200&v=4"
					/>
					<LinkCard
						title="Prisma"
						description="Database ORM with Prisma"
						href="https://www.prisma.io"
						image="https://avatars.githubusercontent.com/u/17219288?s=200&v=4"
					/>
					<LinkCard
						title="tRPC"
						description="tRPC for full stack typesafety"
						href="https://trpc.io"
						image="https://avatars.githubusercontent.com/u/78011399?s=48&v=4"
					/>
				</div>
			</div>
		</div>
	);
}
