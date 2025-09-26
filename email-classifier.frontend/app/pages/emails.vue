<script setup lang="ts">
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const Icon = resolveComponent("Icon");

const http = useHttp();

const filters: Partial<IFilters> = {
	page: 1,
	limit: 10,
};

const data = ref<IEmailResponse["data"]["items"]>();
const total = ref(0);

const selectedRow = ref<IEmailResponse["data"]["items"][0]>();
const isOpen = ref(false);

async function search() {
	try {
		const request = await http.get<IEmailResponse>(`/email/list${objectToQueryString(filters)}`);

		if (request.status === 200 && request.success) {
			data.value = request.data.items;
			total.value = request.data.total;
		} else {
			data.value = [];
			total.value = 0;
			throw new Error(request.message || "Erro desconhecido");
		}
	} catch (error) {
		console.error("Erro ao buscar dados:", error);
	}
}

onMounted(async () => {
	await search();
});
</script>

<template>
	<UContainer class="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 items-start">
		<Hero />

		<UModal
			v-model:open="isOpen"
			:title="selectedRow?.subject || 'Detalhes do Email'"
			:close="{
				color: 'primary',
				variant: 'outline',
				class: 'rounded-full',
			}"
		>
			<template #body>
				<Classification :classificationData="selectedRow!" />
			</template>
		</UModal>

		<UCard class="col-span-12">
			<div class="flex items-center justify-between gap-4 mb-4">
				<div class="flex items-center gap-2">
					<UButton
						@click="
							() => {
								$router.push('/');
							}
						"
						icon="fa6-solid:envelope-circle-check"
						color="primary"
					>
						Nova Classificação
					</UButton>
				</div>
				<UButton @click="search" icon="fa6-solid:arrows-rotate"> </UButton>
			</div>

			<UTable
				ref="table"
				:data="data"
				:columns="[
					{
						accessorKey: '#',
						meta: {
							class: {
								th: 'text-center',
								td: 'text-center'
							}
						},
						cell: ({ row }) => {
							return h(UButton, { class: 'capitalize', color: 'neutral', variant: 'outline', onClick: () => (selectedRow = row.original) && (isOpen = true) }, () => h(Icon, { name: 'fa6-regular:eye' }, () => null))
						}
					},
					{
						accessorKey: 'status',
						header: 'Status',
						meta: {
							class: {
								th: 'text-center',
								td: 'text-center'
							}
						},
						cell: ({ row }) => {
							const status = row.getValue('status') as string

							const color = status === 'classified' ? 'success' : status === 'error' ? 'error' : 'warning';
							return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => status === 'classified' ? 'Classificado' : status === 'error' ? 'Erro' : 'Pendente')
						}
					},
					{
						accessorKey: 'classification',
						header: 'Classificação',
						meta: {
							class: {
								th: 'text-center',
								td: 'text-center'
							}
						},
						cell: ({ row }) => {
							const classification = row.getValue('classification') as string

							const color = classification === 'productive'
									? 'primary'
									: classification === 'unproductive'
									? 'warning'
									: 'neutral'

							return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
       							classification === 'productive'
									? 'Produtivo'
									: classification === 'unproductive'
									? 'Improdutivo'
									: 'Sem Classificação'
      						)
							// return h(
							// 	'span',
							// 	{
							// 		class: `font-semibold capitalize ${colorMap[classification as keyof typeof colorMap]}`
							// 	},
							// 	classification === 'productive' ? 'Produtivo' : (classification === 'unproductive' ? 'Improdutivo' : 'Sem Classificação')
							// )
						}
					},
					{
						accessorKey: 'sender',
						header: 'Remetente',
					},
					{
						accessorKey: 'subject',
						header: 'Assunto',
					},
					{
						accessorKey: 'body',
						header: 'Corpo',
						cell: ({ row }) => {
							const body = row.getValue('body') as string
							return body.length > 50 ? body.substring(0, 40) + '...' : body
						}
					},
					{
						accessorKey: 'updatedAt',
						header: 'Atualizado em',
						cell: ({ row }) => {
							return new Date(row.getValue('updatedAt')).toLocaleString('pt-BR', {
								day: 'numeric',
								month: 'short',
								hour: '2-digit',
								minute: '2-digit'
							})
						}
					},
				]"
				class="flex-1 w-full"
			>
				<template #empty>
					<div class="flex flex-col items-center justify-center my-10">
						<p class="text-gray-500">Nenhum email encontrado.</p>
					</div>
				</template>
			</UTable>

			<div class="flex justify-between border-t border-accented pt-4">
				<div></div>

				<UPagination :default-page="1" :items-per-page="filters.limit" :total="total" @update:page="(p) => (filters.page = p) && search()" />
			</div>
		</UCard>
	</UContainer>
</template>
