<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute();
const siteUrl = config.public.siteUrl.replace(/\/+$/, ""); // sem barra no fim
const absoluteUrl = `${siteUrl}${route.fullPath.startsWith("/") ? "" : "/"}${route.fullPath}`;

const title = "Email Classifier";
const description = "Classificação automática de e-mails com IA, filas e arquitetura escalável.";

useSeoMeta({
	title,
	ogTitle: title,
	description,
	ogDescription: description,
	ogType: "website",
	ogUrl: absoluteUrl,
	// ogImage: imageAbs,
	twitterCard: "summary_large_image",
	twitterTitle: title,
	twitterDescription: description,
	// twitterImage: imageAbs,
});

// Canonical
useHead({
	link: [{ rel: "canonical", href: absoluteUrl }],
});
</script>

<template>
	<UApp>
		<Header />

		<UMain>
			<NuxtLayout>
				<NuxtPage />
			</NuxtLayout>
		</UMain>

		<Footer />
	</UApp>
</template>
