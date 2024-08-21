import { TRPCReactProvider } from "~/trpc/react";
import { Inter } from "next/font/google";
import { cn } from "~/lib/utils";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import "../styles/globals.css";

export const metadata: Metadata = {
	title: "Whop SaaS Template",
	description: "A starter for building and monetizing your web app on Whop",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body
				className={cn(
					"dark min-h-screen bg-background font-sans antialiased",
					inter.variable
				)}
			>
				<TRPCReactProvider>{children}</TRPCReactProvider>
			</body>
		</html>
	);
}
