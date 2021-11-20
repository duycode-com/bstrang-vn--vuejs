<template>
	<div class="flex justify-between">
		<div>
			<div class="flex">
				<div class="w-10">Tên</div>
				<div class="w-3">:</div>
				<div>{{ customer.customerName }}</div>
			</div>
			<div class="flex">
				<div class="w-10">SĐT</div>
				<div class="w-3">:</div>
				<div>{{ customer.phone }}</div>
			</div>
			<div class="flex">
				<div class="w-10">Đ/c</div>
				<div class="w-3">:</div>
				<div>{{ customer.address }}</div>
			</div>
			<div>
				<a-button @click="$refs.modalCustomerCreateModify.openModal(customer.customerID)">Edit</a-button>
				<ModalCustomerCreateModify ref="modalCustomerCreateModify" />
			</div>
		</div>
		<div>
			<div>NỢ</div>
			<div class="text-3xl">{{ customer.finance?.debt }}</div>
		</div>
		<div>
			<a-popconfirm @confirm="startPayDebt" @cancel="payDebtMoney = 0">
				<template #title>
					<p>Nhập số tiền trả nợ ?</p>
					<a-input v-model:value.number="payDebtMoney" placeholder="Payup Money" />
				</template>
				<a-button size="large" type="primary">Trả nợ</a-button>
			</a-popconfirm>
		</div>
	</div>
	<div class="mt-8 font-bold">Danh sách đơn hàng</div>
	<div class="wrapper-table">
		<table class="table">
			<thead>
				<th>#</th>
				<th>Ngày</th>
				<th>HT Thanh Toán</th>
				<th>Đã thanh toán</th>
				<th>Tổng đơn hàng</th>
				<th>Nợ</th>
			</thead>
			<tbody class="text-right">
				<tr v-if="!customer.exportNoteList || Object.keys(customer.exportNoteList).length === 0">
					<td class="text-center" colspan="7">No data available in table</td>
				</tr>
				<tr
					v-for="(noteData, noteID, noteIndex) in customer.exportNoteList"
					:key="noteIndex"
					@click="$router.push({ name: 'ExportNote Details', params: { id: noteID } })"
				>
					<td class="text-center">{{ noteIndex + 1 }}</td>
					<td>{{ formatDateTime(noteData.createdAt) }}</td>
					<td class="text-left">{{ noteData.payment?.method }}</td>
					<td>{{ noteData.payment?.alreadyPaid }}</td>
					<td>{{ noteData.finance.revenue }}</td>
					<td class="font-bold">{{ noteData.finance.revenue - noteData.payment?.alreadyPaid }}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="mt-8 font-bold">Lịch sử trả nợ</div>
	<div class="wrapper-table mb-2">
		<table class="table">
			<thead>
				<th>#</th>
				<th>Thời gian</th>
				<th>Tiền trả</th>
			</thead>
			<tbody class="text-right">
				<tr v-if="Object.keys(customer.finance?.payDebt || {}).length === 0">
					<td class="text-center" colspan="3">No data available in table</td>
				</tr>
				<tr v-for="(money, time, index) in customer.finance?.payDebt" :key="index">
					<td class="text-center">{{ index + 1 }}</td>
					<td>{{ formatDateTime(Number(time)) }}</td>
					<td>{{ money }}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="flex justify-between mt-4">
		<a-button @click="$router.go(-1)">Back</a-button>
		<a-popconfirm
			title="Warning !!! Are you sure delete this customer?"
			@confirm="startDeleteCustomer(customer.customerID)"
		>
			<a-button type="dashed">Delete</a-button>
		</a-popconfirm>
	</div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { startRealtimeCustomer, addPayDebt, deleteCustomer } from '@/firebase/useCustomer'
import ModalCustomerCreateModify from '@/components/common/ModalCustomerCreateModify.vue'
import { MyFormatDateTime } from '@/utils/convert'

export default {
	components: { ModalCustomerCreateModify },
	setup() {
		const route = useRoute()
		const realtimeCustomer = startRealtimeCustomer(route.params.id)
		return {
			customer: realtimeCustomer.data,
			realtimeCustomer,
			payDebtMoney: ref(0),
		}
	},
	unmounted() {
		this.realtimeCustomer.unSubscribe()
	},
	methods: {
		async startPayDebt() {
			try {
				await addPayDebt(this.customer.customerID, this.payDebtMoney)
				message.loading(`${this.customer.customerName} has just pay debt ${this.payDebtMoney}`)
			} catch (error) {
				message.error('Pay debt error')
			}
		},
		async startDeleteCustomer() {
			try {
				this.realtimeCustomer.unSubscribe()
				await deleteCustomer(this.customer.customerID)
				this.$router.push({ name: 'Customer List', params: {} })
				message.success('Delete customer success !!!', 2)
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
