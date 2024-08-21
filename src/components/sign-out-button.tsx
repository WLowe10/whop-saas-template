"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";

export type SignOutButtonProps = {
	className?: string;
};

export const SignOutButton = ({ className }: SignOutButtonProps) => {
	const router = useRouter();
	const signOutMutation = api.auth.signOut.useMutation();

	const signOut = () => {
		signOutMutation.mutate(undefined, {
			onSuccess: () => {
				router.replace("/");
				router.refresh();
			},
		});
	};

	return (
		<Button
			className={className}
			onClick={signOut}
			variant="outline"
			disabled={signOutMutation.isPaused}
		>
			Sign Out
		</Button>
	);
};
