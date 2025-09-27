// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		baseURL: "/email-classifier/",
	},

	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui", "nuxt-lottie", "@nuxtjs/mdc"],
	css: ["~/assets/css/main.css"],

	ssr: false,

	runtimeConfig: {
		public: {
			backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
			siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
		},
	},
});
