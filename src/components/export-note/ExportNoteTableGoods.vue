<template>
	<table>
		<thead>
			<th>#</th>
			<th>Tên SP</th>
			<th>HSD</th>
			<th>Nhập</th>
			<th>SL</th>
			<th>Bán</th>
			<th>Tổng</th>
			<th v-if="editable">Action</th>
		</thead>
		<tbody class="text-right">
			<template v-for="(batchList, goodsID, stockIndex) in exportNote.stockOut" :key="stockIndex">
				<tr
					v-for="({ quantity, actualPrice, expectedPrice }, batchKey, batchIndex) in batchList"
					:key="batchIndex"
				>
					<td class="text-center" v-if="batchIndex === 0" :rowspan="Object.keys(batchList).length">
						{{ stockIndex + 1 }}
					</td>
					<td style="text-align: left" v-if="batchIndex === 0" :rowspan="Object.keys(batchList).length">
						{{ goodsList[goodsID]?.goodsName }}
					</td>
					<td>{{ formatDateTime(Number(batchKey.split('-')[0])) }}</td>
					<td>{{ batchKey.split('-')[1] }}</td>
					<td class="font-bold">{{ quantity }}</td>
					<td class="text-right">
						<p v-if="expectedPrice !== actualPrice" class="text-xs line-through italic text-yellow-500">
							{{ expectedPrice }}
						</p>
						<p>{{ actualPrice }}</p>
					</td>
					<td>{{ quantity * actualPrice }}</td>
					<td v-if="editable">
						<div class="flex justify-between">
							<EditTwoTone
								@click="$emit('editStockOut', { goodsID, batchKey })"
								twoToneColor="orange"
								class="delete-row-goods"
							/>
							<a-popconfirm
								@confirm="$emit('removeStockOut', { goodsID, batchKey })"
								title="Bạn có chắc muốn xóa sản phẩm này?"
								class="ml-4"
							>
								<DeleteTwoTone twoToneColor="#f5222d" />
							</a-popconfirm>
						</div>
					</td>
				</tr>
			</template>
			<tr>
				<td colspan="6">
					Shipping ({{ exportNote.shipping?.unit }} - {{ exportNote.shipping?.whoPays }} pays)
				</td>
				<td>{{ exportNote.shipping?.cost }}</td>
				<td v-if="editable"></td>
			</tr>
			<tr style="font-weight:bold">
				<td colspan="6">Tổng đơn hàng</td>
				<td>{{ exportNote.finance?.revenue }}</td>
				<td v-if="editable"></td>
			</tr>
			<tr>
				<td colspan="6">KH đã trả ({{ exportNote.payment?.method }})</td>
				<td>{{ exportNote.payment?.alreadyPaid }}</td>
				<td v-if="editable"></td>
			</tr>
			<tr>
				<td colspan="6">
					KH còn thiếu
				</td>
				<td>
					{{ exportNote.finance?.revenue - exportNote.payment?.alreadyPaid }}
				</td>
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
		exportNote: Object,
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
