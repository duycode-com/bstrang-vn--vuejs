<template>
	<div>
		<div class="flex">
			<div class="w-10">Tên</div>
			<div class="w-3">:</div>
			<div>{{ provider.providerName }}</div>
		</div>
		<div class="flex">
			<div class="w-10">SĐT</div>
			<div class="w-3">:</div>
			<div>{{ provider.phone }}</div>
		</div>
		<div class="flex">
			<div class="w-10">Đ/c</div>
			<div class="w-3">:</div>
			<div>{{ provider.address }}</div>
		</div>
		<div>
			<a-button @click="$refs.modalProviderCreateModify.openModal(provider.providerID)">Edit</a-button>
			<ModalProviderCreateModify ref="modalProviderCreateModify" />
		</div>
	</div>

	<div class="mt-8 font-bold">Import List</div>
	<div class="wrapper-table">
		<table class="table">
			<thead>
				<th>#</th>
				<th>Ngày</th>
				<th>Tổng tiền</th>
			</thead>
			<tbody>
				<tr v-if="!provider.importNoteList || Object.keys(provider.importNoteList).length === 0">
					<td class="text-center" colspan="4">No data available in table</td>
				</tr>
				<tr v-for="(noteData, noteID, noteIndex) in provider.importNoteList" :key="noteIndex">
					<td class="text-center">{{ noteIndex + 1 }}</td>
					<td class="text-right">{{ formatDateTime(noteData.createdAt) }}</td>
					<td class="text-right font-bold">{{ noteData.finance.totalMoney }}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="flex justify-between mt-4">
		<a-button @click="$router.go(-1)">Back</a-button>
		<a-popconfirm
			title="Warning !!! Are you sure delete this provider?"
			@confirm="startDeleteProvider(provider.providerID)"
		>
			<a-button type="dashed">Delete</a-button>
		</a-popconfirm>
	</div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { startRealtimeProvider, deleteProvider } from '@/firebase/useProvider'
import ModalProviderCreateModify from '@/components/common/ModalProviderCreateModify.vue'
import { MyFormatDateTime } from '@/utils/convert'

export default {
	components: { ModalProviderCreateModify },
	setup() {
		const route = useRoute()
		const realtimeProvider = startRealtimeProvider(route.params.id)
		console.log(realtimeProvider.data)
		return {
			provider: realtimeProvider.data,
			realtimeProvider,
			payDebtMoney: ref(0),
		}
	},
	unmounted() {
		this.realtimeProvider.unSubscribe()
	},
	methods: {
		async startDeleteProvider() {
			try {
				this.realtimeProvider.unSubscribe()
				await deleteProvider(this.provider.providerID)
				this.$router.push({ name: 'Provider List', params: {} })
				message.success('Delete provider success !!!', 2)
			} catch (error) {
				console.error(error)
			}
		},
		formatDateTime(time) {
			return MyFormatDateTime(time, 'DD/MM/YY')
		},
	},
}
</script>
