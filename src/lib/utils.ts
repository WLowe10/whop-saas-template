import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
/**
 * Returns a checkout url for the given plan
 * @param planId The plan id
 * @returns url
 */
export const getCheckoutUrl = (planId: string) => `https://whop.com/checkout/${planId}?d2c=true`;

/**
 * Returns a url to manage a membership
 * @param planId The membership id
 * @returns url
 */
export const getManageUrl = (membershipId: string) => `https://whop.com/orders/${membershipId}`;
