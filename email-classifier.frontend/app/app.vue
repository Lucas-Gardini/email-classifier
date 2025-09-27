<script setup lang="ts">
useSeo({
	title: "Email Classifier",
	description: "Classificação automática de e-mails com IA, filas e arquitetura escalável.",
	pathname: "/",
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
