<script setup lang="ts">
const toast = useToast();

const props = defineProps<{
	classificationData: IEmailResponse["data"]["items"][0];
}>();

function copySuggestion() {
	if (props.classificationData?.suggestion.suggestedResponse) {
		navigator.clipboard.writeText(props.classificationData.suggestion.suggestedResponse);
		toast.add({ title: "Copiado", description: "Sugestão de resposta copiada para a área de transferência.", color: "success" });
	}
}
</script>

<template>
	<!-- Resumo -->
	<div class="mb-4">
		<h3 class="text-lg font-semibold">Resumo</h3>
		<span style="white-space: pre-line" class="text-sm">
			{{ classificationData.suggestion.summary }}
		</span>
	</div>

	<!-- Sugestão de resposta -->
	<div>
		<h3 class="text-lg font-semibold">Sugestão de Resposta</h3>
		<UAlert
			style="white-space: pre-line"
			color="neutral"
			variant="subtle"
			:description="classificationData.suggestion.suggestedResponse"
			icon="fa6-regular:lightbulb"
		/>

		<div class="flex justify-end my-1">
			<UTooltip text="Copiar sugestão">
				<UButton size="sm" variant="ghost" color="primary" icon="fa6-regular:copy" @click="copySuggestion" />
			</UTooltip>
		</div>
	</div>

	<!-- Metadados -->
	<div class="text-xs text-gray-500 flex flex-col sm:flex-row sm:justify-between mt-auto">
		<span class="flex items-center gap-1">
			<Icon name="fa6-regular:calendar" class="w-3 h-3" />
			Criado em: {{ new Date(classificationData.createdAt).toLocaleString("pt-BR") }}
		</span>
		<span class="flex items-center gap-1">
			<Icon name="fa6-regular:clock" class="w-3 h-3" />
			Atualizado em: {{ new Date(classificationData.updatedAt).toLocaleString("pt-BR") }}
		</span>
	</div>
</template>
