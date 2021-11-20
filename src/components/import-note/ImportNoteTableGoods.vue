<template>
	<table>
		<thead>
			<th>#</th>
			<th>Tên</th>
			<th>HSD</th>
			<th>Nhập</th>
			<th>SL</th>
			<th>Tổng</th>
			<th v-if="editable">Action</th>
		</thead>
		<tbody class="text-right">
			<template v-for="(batchList, goodsID, stockIndex) in importNote.stockIn" :key="stockIndex">
				<tr v-for="({ quantity }, batchKey, batchIndex) in batchList" :key="batchIndex">
					<td class="text-center" v-if="batchIndex === 0" :rowspan="Object.keys(batchList).length">
						{{ stockIndex + 1 }}
					</td>
					<td class="text-left" v-if="batchIndex === 0" :rowspan="Object.keys(batchList).length">
						{{ goodsList[goodsID]?.goodsName }}
					</td>
					<td>{{ formatDateTime(Number(batchKey.split('-')[0])) }}</td>
					<td>{{ batchKey.split('-')[1] }}</td>
					<td class="font-bold">{{ quantity }}</td>
					<td>{{ quantity * Number(batchKey.split('-')[1]) }}</td>
					<td v-if="editable">
						<div class="flex justify-between">
							<EditTwoTone
								@click="$emit('editStockIn', { goodsID, batchKey })"
								twoToneColor="orange"
								class="delete-row-goods"
							/>
							<a-popconfirm
								@confirm="$emit('removeStockIn', { goodsID, batchKey })"
								title="Are you sure delete this task?"
								class="ml-4"
							>
								<DeleteTwoTone twoToneColor="#f5222d" />
							</a-popconfirm>
						</div>
					</td>
				</tr>
			</template>
			<tr>
				<td colspan="5">Shipping</td>
				<td>{{ importNote.shipping?.cost }}</td>
				<td v-if="editable"></td>
			</tr>
			<tr style="font-weight:bold">
				<td colspan="5">Tổng tiền</td>
				<td>{{ importNote.finance?.totalMoney }}</td>
				<td v-if="editable"></td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons-vue'
import { goodsList } from '@/firebase/useWarehouse'
import { MyFormatDateTime } from '@/utils/convert'

export default {
	components: { EditTwoTone, DeleteTwoTone },
	props: {
		importNote: Object,
		editable: Boolean,
	},
	setup() {
		return { goodsList }
	},
	methods: {
		formatDateTime(time) {
			return MyFormatDateTime(time, 'DD/MM/YY')
		},
	},
}
</script>
