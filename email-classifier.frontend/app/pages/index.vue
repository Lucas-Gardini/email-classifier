<script setup lang="ts">
const toast = useToast();

const classifyEmailRef = ref();

const readyForAnalysis = ref(true);
const classifying = ref(false);
const classificationId = ref<string | null>(null);
const poolingInterval = ref<NodeJS.Timeout | string | number | undefined>();

const classificationData = ref<IEmailResponse["data"]["items"][0] | null>(null);

function classifyEmail() {
	if (classificationData.value && classificationData.value?.status !== "pending") {
		classifyEmailRef.value?.clearForm();
		classificationData.value = null;
		readyForAnalysis.value = true;
		classifying.value = false;
		return;
	}

	classifyEmailRef.value?.submitForm();
	classifying.value = true;
}

function onData(data: string) {
	readyForAnalysis.value = false;
	classifying.value = true;
	classificationId.value = data;

	poolingInterval.value = setInterval(async () => {
		const http = useHttp();
		const request = await http.get<IEmailResponse>(`/email/list?id=${classificationId.value}&page=1&limit=1`);

		try {
			if (request.status === 200 && request.success) {
				if (request.data.items[0]?.status === "error") throw new Error("A classificação falhou. Por favor, tente novamente.");

				classificationData.value = request.data.items[0]!;

				if (request.data.items[0]?.status === "pending") return; // Ainda processando

				classifying.value = false;
				classificationId.value = null;

				if (poolingInterval.value) clearInterval(poolingInterval.value!);
			} else if (request.status === 202) {
				// Ainda processando
			} else {
				throw new Error(request.message || "Erro desconhecido");
			}
		} catch (error) {
			onError(error);
			if (poolingInterval.value) clearInterval(poolingInterval.value);
		}
	}, 1000);
}

function onError(error: string | unknown) {
	toast.add({ title: "Erro", description: typeof error === "string" ? error : "Ocorreu um erro ao classificar o email.", color: "error" });
	classifying.value = false;
}
</script>

<template>
	<UContainer class="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 items-start">
		<Hero />

		<UCard class="col-span-12 md:col-span-6">
			<template #header>
				<div class="flex items-center">
					<Icon name="fa6-regular:envelope" class="w-6 h-6 mr-2 text-primary" />
					<span class="font-semibold">Classificar Email</span>
				</div>
			</template>

			<FormsClassifyEmail ref="classifyEmailRef" :loading="classifying" @data="onData" @error="onError" />

			<template #footer>
				<UButton
					@click="classifyEmail"
					class="w-full justify-center"
					:icon="classificationData && classificationData?.status !== 'pending' ? 'fa6-regular:circle-xmark' : 'i-lucide-rocket'"
					:loading="classifying"
				>
					{{ classificationData && classificationData?.status !== "pending" ? "Classificar Outro" : "Analisar e Classificar" }}
				</UButton>
			</template>
		</UCard>

		<UCard class="flex flex-col col-span-12 md:col-span-6" :class="readyForAnalysis || classifying ? 'h-full' : ''" :ui="{ body: 'flex h-full' }">
			<template v-if="classifying || classificationData" #header>
				<div class="flex flex-col gap-5 md:flex-row md:gap-0 items-center justify-between">
					<div class="flex items-center">
						<Icon name="fa6-solid:robot" class="w-6 h-6 mr-2 text-primary" />
						<span class="font-semibold">Análise do E-mail</span>
					</div>
					<div class="flex flex-row items-center gap-2">
						<UBadge
							:color="
								classificationData?.status === 'classified' ? 'success' : classificationData?.status === 'error' ? 'error' : 'warning'
							"
							:icon="
								classificationData?.status === 'classified'
									? 'fa6-regular:circle-check'
									: classificationData?.status === 'error'
									? 'fa6-regular:circle-xmark'
									: 'fa6-regular:circle-dot'
							"
							variant="subtle"
						>
							{{
								classificationData?.status === "classified"
									? "Classificado"
									: classificationData?.status === "error"
									? "Erro"
									: "Pendente"
							}}
						</UBadge>

						<Icon name="fa6-solid:angles-right" class="w-4 h-4 mx-2 text-gray-400" />

						<UBadge
							:color="
								classificationData?.classification === 'productive'
									? 'primary'
									: classificationData?.classification === 'unproductive'
									? 'warning'
									: 'neutral'
							"
							variant="subtle"
						>
							{{
								classificationData?.classification === "productive"
									? "Produtivo"
									: classificationData?.classification === "unproductive"
									? "Improdutivo"
									: "Sem Classificação"
							}}
						</UBadge>
					</div>
				</div>
			</template>

			<div v-if="readyForAnalysis" class="flex flex-col items-center justify-center my-auto">
				<Icon name="fa6-regular:envelope" class="w-12 h-12" />
				<span class="text-lg font-semibold">Pronto para Analisar!</span>
				<span class="text-center">
					Preencha os dados do e-mail e clique em <strong>Analisar e Classificar</strong> para ver insights com IA e sugestões de resposta.
				</span>
			</div>
			<div v-else-if="classifying" class="flex flex-col items-center justify-center w-full">
				<Lottie name="Robot Working" width="100%" class="max-h-[380px]" />
			</div>
			<!-- Resultado da análise -->
			<div v-else-if="classificationData && classificationData.suggestion" class="flex flex-col gap-6">
				<Classification :classificationData="classificationData" />
			</div>
		</UCard>
	</UContainer>
</template>
