"use client";

import { api } from "~/trpc/react";

/*
This component demonstrates client side fetching with tRPC. 
Only subscribed users can see the message returned by the API.

These components are for demonstrative purposes, feel free to remove them.
*/

export const SubscribedMessage = () => {
	const getMessage = api.main.getSubscribedMessage.useQuery();

	return <p className="text-muted-foreground">{getMessage.data?.message || "Loading..."}</p>;
};

export const AuthenticatedMessage = () => {
	const getMessage = api.main.getAuthenticatedMessage.useQuery();

	return <p className="text-muted-foreground">{getMessage.data?.message || "Loading..."}</p>;
};
