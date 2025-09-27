<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
	{
		label: "Classificador",
		to: "/",
		active: route.path === "/",
	},
	{
		label: "Emails",
		to: "/emails",
		active: route.path.startsWith("/emails"),
	},
]);
</script>

<template>
	<UHeader mode="modal">
		<template #title>
			<Icon name="simple-icons:maildotru" class="w-6 h-6 mr-2 text-primary" />
		</template>

		<UNavigationMenu :items="items" />

		<template #right>
			<UColorModeButton />

			<UTooltip text="Abrir no GitHub" :kbds="['meta', 'G']">
				<UButton
					color="neutral"
					variant="ghost"
					to="https://github.com/Lucas-Gardini/email-classifier"
					target="_blank"
					icon="i-simple-icons-github"
					aria-label="GitHub"
				/>
			</UTooltip>
		</template>

		<template #body>
			<UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
		</template>
	</UHeader>
</template>
