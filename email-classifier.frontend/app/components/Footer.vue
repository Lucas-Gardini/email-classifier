<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items: NavigationMenuItem[] = [
	{
		label: "Figma Kit",
		to: "https://go.nuxt.com/figma-ui",
		target: "_blank",
	},
	{
		label: "Playground",
		to: "https://stackblitz.com/edit/nuxt-ui",
		target: "_blank",
	},
	{
		label: "Releases",
		to: "https://github.com/nuxt/ui/releases",
		target: "_blank",
	},
];
</script>

<template>
	<UFooter>
		<template #left>
			<p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }}</p>
		</template>

		<div>
			<span> Feito com ❤️ por </span>
			<a href="https://lucasgardini.com" target="_blank" class="underline">Lucas Gardini</a>
		</div>
	</UFooter>
</template>
