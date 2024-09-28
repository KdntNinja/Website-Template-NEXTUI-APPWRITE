"use client";

import { CardHeader, CardBody, Card, Spacer, Button } from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";

const Section = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<Card className="w-full max-w-4xl mt-12">
		<CardHeader>
			<p className="text-lg font-semibold">{title}</p>
		</CardHeader>
		<CardBody>
			<p>{children}</p>
		</CardBody>
	</Card>
);

const AboutPage = () => {
	const router = useRouter();

	return (
		<div className="flex justify-center">
			<div className="w-full max-w-7xl">
				<div className="flex flex-col items-center py-12 px-4 md:px-8 lg:px-16 w-full">
					<p className={`${title()} leading-tight text-center`}>About</p>
					<p className={`${title({ color: "violet" })} text-center mb-6 mt-4`}>
						{siteConfig.name}&nbsp;
					</p>
					<p className={`${subtitle()} text-center max-w-3xl mb-8`}>
						{siteConfig.name} is a modern, fast, and intuitive platform for
						managing your documents. With a sleek design and robust features,{" "}
						{siteConfig.name} aims to enhance your document management
						experience, making it easier to collaborate, track progress, and
						ensure the security of your documents.
					</p>

					<Section title="Our Mission">
						At {siteConfig.name}, our mission is to provide a seamless and
						efficient platform for managing documents. We strive to enhance
						collaboration, improve document tracking, and ensure the security of
						your documents.
					</Section>

					<Spacer y={2} />

					<Section title="Get Started">
						Ready to take your document management to the next level? Get
						started with {siteConfig.name} today and experience the difference.
						<Button
							className="transition-transform hover:scale-105 mt-4"
							color="primary"
							variant="flat"
							onClick={() => router.push(siteConfig.routes.signup)}
						>
							Get Started with {siteConfig.name}
						</Button>
					</Section>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
