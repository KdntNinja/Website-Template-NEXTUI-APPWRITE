const routes = {
	home: "/",
	about: "/about",
	login: "/login",
	signup: "/signup",
	verify: "/verify",
	dashboard: "/dashboard",
	profile: "/profile",
	doc: "/dashboard/doc",
	settings: "/settings",
};

export const siteConfig = {
	name: "Versionary",
	prodDomain: "https://kdnsite.xyz",
	title_p1: "The new",
	title_p2: "Docs",
	title_p3: "management solution.",
	description: "Beautiful, fast, and modern. Everything you need.",
	routes,
	navItems: [
		{
			label: "Home",
			href: routes.home,
		},
		{
			label: "About",
			href: routes.about,
		},
	],
	features: [
		{
			label: "Real-time Collaboration",
			description:
				"Work together with your team in real-time, no matter where you are.",
		},
		{
			label: "Sleek Modern Design",
			description:
				"Enjoy a visually stunning interface that enhances user experience and engagement.",
		},
		{
			label: "Intuitive Document Management",
			description:
				"Easily organize, track, and collaborate on documents with user-friendly tools.",
		},
		{
			label: "Robust Security",
			description:
				"Keep your documents safe with advanced security features and regular backups.",
		},
		{
			label: "Seamless Integration",
			description:
				"Integrate effortlessly with your favorite tools and services for a streamlined workflow.",
		},
		{
			label: "Customizable Workflows",
			description:
				"Tailor your document management experience with flexible and customizable workflows.",
		},
	],
};
