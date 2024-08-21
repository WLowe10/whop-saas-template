import { IconArrowRight } from "@tabler/icons-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "~/lib/utils";

export type LinkCardProps = {
	title: string;
	image: string;
	href: string;
	description: string;
	className?: string;
};

export const LinkCard = ({ title, image, href, description, className }: LinkCardProps) => {
	return (
		<a href={href} target="_blank" className={cn("group", className)}>
			<Card className="h-full transition-colors border-zinc-900 group-hover:border-border">
				<CardHeader>
					<div className="flex justify-between items-center mb-2">
						<div className="flex gap-2 items-center">
							<Avatar className="max-w-[42px]">
								<AvatarImage src={image} />
							</Avatar>
							<CardTitle>{title}</CardTitle>
						</div>
						<IconArrowRight
							size={20}
							className="opacity-50 transition-[transform,opacity] group-hover:translate-x-1 group-hover:opacity-100"
						/>
					</div>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
			</Card>
		</a>
	);
};
