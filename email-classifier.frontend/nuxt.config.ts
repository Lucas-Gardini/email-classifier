// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		baseURL: "/email-classifier/",

		head: {
			titleTemplate: "Email Classifier",
			htmlAttrs: { lang: "pt-BR" },
			meta: [{ name: "description", content: "Classificação automática de e-mails com IA, filas e arquitetura escalável." }],
			// link: [
			// 	{ rel: "icon", type: "image/png", href: "/favicon-32x32.png", sizes: "32x32" },
			// 	{ rel: "icon", type: "image/png", href: "/favicon-16x16.png", sizes: "16x16" },
			// 	{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
			// 	{ rel: "manifest", href: "/site.webmanifest" },
			// ],
		},
	},

	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui", "nuxt-lottie", "@nuxtjs/mdc"],
	css: ["~/assets/css/main.css"],

	// Precisa de SSR pra crawlers verem <title>, <meta>, headings etc.
	ssr: true,

	runtimeConfig: {
		public: {
			backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
			siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000/email-classifier",
		},
	},
});
