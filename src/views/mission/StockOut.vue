<template>
  <a-card :bordered="false">
    <!-- table区域-begin -->
    <a-table
      ref="table"
      size="middle"
      :scroll="{ x: true }"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      class="j-table-force-nowrap"
      @change="handleTableChange"
    >
      <template slot="htmlSlot" slot-scope="text">
        <div v-html="text"></div>
      </template>
      <template slot="imgSlot" slot-scope="text">
        <span v-if="!text" style="font-size: 12px; font-style: italic"
          >无图片</span
        >
        <img
          v-else
          :src="getImgView(text)"
          height="25px"
          alt=""
          style="max-width: 80px; font-size: 12px; font-style: italic"
        />
      </template>
      <template slot="fileSlot" slot-scope="text">
        <span v-if="!text" style="font-size: 12px; font-style: italic"
          >无文件</span
        >
        <a-button
          v-else
          :ghost="true"
          type="primary"
          icon="download"
          size="small"
          @click="downloadFile(text)"
        >
          下载
        </a-button>
      </template>

      <span slot="action" slot-scope="text, record">
        <div class="btn-group">
          <a @click="handlePass(record)">通过</a>
          <a @click="handleBack(record)">退回</a>
        </div>
      </span>
    </a-table>

    <!-- 出库表单 -->
    <StockOutTipsModal ref="stockOutTipsModal" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import StockOutTipsModal from './materialManagement/StockOutTipsModal'

export default {
  name: 'StockOut',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    StockOutTipsModal,
  },
  data() {
    return {
      description: '耗材管理管理页面',
      title: '',
      width: 1280,
      disableSubmit: false,
      stockInVisible: false,
      stockOutVisible: false,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '耗材名称',
          align: 'center',
          dataIndex: 'materialName',
        },
        {
          title: '耗材编码',
          align: 'center',
          dataIndex: 'materialCode',
        },
        {
          title: '耗材类型',
          align: 'center',
          dataIndex: 'materialType',
        },
        {
          title: '耗材出库数量',
          align: 'center',
          dataIndex: 'materialStockOutTotal',
        },
        {
          title: '出库人',
          align: 'center',
          dataIndex: 'stockOutPerson',
        },
        {
          title: '出库时间',
          align: 'center',
          dataIndex: 'stockOutTime',
        },
        {
          title: '审核人',
          align: 'center',
          dataIndex: 'auditorPerson',
        },
        {
          title: '审核时间',
          align: 'center',
          dataIndex: 'auditorTime',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/mission/materialManagement/list',
        delete: '/mission/materialManagement/delete',
        deleteBatch: '/mission/materialManagement/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportXls',
        importExcelUrl: 'mission/materialManagement/importExcel',
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    handlePass(record) {
      this.$refs.stockOutTipsModal.show()
    },
    handleBack(record) {},
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
.btn-group {
  display: flex;
  justify-content: space-evenly;
}
</style>
