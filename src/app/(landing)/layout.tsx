import Link from "next/link";
import { validateRequest } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { IconWhop } from "~/components/icons/whop";
import { IconPencil } from "@tabler/icons-react";
import type { PropsWithChildren } from "react";

export default async function LandingLayout({ children }: PropsWithChildren) {
	const { user } = await validateRequest();

	return (
		<div className="min-h-screen flex flex-col">
			<header className="p-4 mb-60">
				<nav className="mx-auto container flex justify-between items-center">
					<Link className="font-bold text-md" href="/">
						<div className="flex gap-2 items-center">
							<IconWhop height={32} width={32} />
							<span className="font-bold text-md">Whop SaaS</span>
						</div>
					</Link>
					<div className="flex gap-4 items-center">
						<Button variant="link" asChild>
							<Link href="/pricing">Pricing</Link>
						</Button>
						<Button variant="outline" asChild>
							{user ? (
								<Link href="/dashboard">Dashboard</Link>
							) : (
								<a href="/api/whop/sign-in">Sign In</a>
							)}
						</Button>
					</div>
				</nav>
			</header>
			<main className="flex-1">{children}</main>
			<footer className="border-t border-border p-4">
				<div className="flex items-center gap-2">
					<IconPencil size={1} />
					<span>
						Get started by editing{" "}
						<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
							app/(landing)/page.tsx
						</code>{" "}
					</span>
				</div>
			</footer>
		</div>
	);
}
