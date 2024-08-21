import { IconCheck } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { getCheckoutUrl } from "~/lib/utils";

export type PricingCardProps = {
	planId: string;
	title: string;
	price: number | string;
	features: string[];
	className?: string;
};

export const PricingCard = ({ title, planId, price, features, className }: PricingCardProps) => {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="text-center">{title}</CardTitle>
				<CardDescription className="text-center text-lg font-bold">
					${price}/mo
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col items-center">
				<ul className="flex flex-col gap-2">
					{features.map((feature, idx) => (
						<li className="flex items-center gap-2" key={idx}>
							<IconCheck size={20} />
							<p>{feature}</p>
						</li>
					))}
				</ul>
			</CardContent>
			<CardFooter>
				<Button className="w-full" asChild>
					<a href={getCheckoutUrl(planId)}>Get Started</a>
				</Button>
			</CardFooter>
		</Card>
	);
};
