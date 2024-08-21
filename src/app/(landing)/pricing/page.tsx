import { PricingCard } from "~/components/pricing-card";
import { env } from "~/env";

export default function PricingPage() {
	return (
		<div className="container">
			<div className="flex flex-col gap-2 text-center mb-10">
				<h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight lg:text-4xl">
					Pricing
				</h1>
				<p className="text-muted-foreground">Pay for what you need</p>
			</div>
			<div className="flex justify-center">
				<PricingCard
					className="max-w-sm w-full"
					title="Starter"
					price={10}
					planId={env.PLAN_ID}
					features={["10,000 requests/mo", "Unlimited users", "Unlimited projects"]}
				/>
			</div>
		</div>
	);
}
