<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, Form } from "@nuxt/ui";

const http = useHttp();

const form = ref<Form<Schema>>();

const schema = z.object({
	subject: z.optional(z.string("Assunto inválido")),
	sender: z.optional(z.email("Email inválido")),
	body: z.string("O corpo do email é obrigatório").min(1, "O corpo do email é obrigatório"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
	subject: undefined,
	sender: undefined,
	body: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	const request = await http.post<IClassifyResponse>("/email/classify", event.data);

	if (request.status === 200 && request.success) emit("data", request.data);
	else emit("error", request.message);
}

const submitForm = () => form.value?.submit();
const clearForm = () => {
	form.value?.clear();
	state.body = "";
	state.subject = undefined;
	state.sender = undefined;
};

defineExpose({ submitForm, clearForm });
defineProps<{ loading: boolean }>();
const emit = defineEmits(["data", "error"]);
</script>

<template>
	<UForm ref="form" :schema="schema" :state="state" class="space-y-2" @submit="onSubmit" @error="$emit('error', $event)">
		<UFormField label="Remetente" name="sender">
			<UInput v-model="state.sender" class="w-full" :disabled="loading" />
			<template #error><div></div></template>
		</UFormField>

		<UFormField label="Assunto" name="subject">
			<UInput v-model="state.subject" class="w-full" :disabled="loading" />
			<template #error><div></div></template>
		</UFormField>

		<UFormField label="Corpo *" name="body">
			<UTextarea v-model="state.body" class="w-full" :rows="8" :disabled="loading" style="resize: none" />
			<template #error><div></div></template>
		</UFormField>
	</UForm>
</template>
