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
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      class="j-table-force-nowrap"
      @change="handleTableChange"
    >
      <template slot="htmlSlot" slot-scope="text">
        <div v-html="text"></div>
      </template>
      <template slot="imgSlot" slot-scope="text">
        <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
        <img
          v-else
          :src="getImgView(text)"
          height="25px"
          alt=""
          style="max-width:80px;font-size: 12px;font-style: italic;"
        />
      </template>
      <template slot="fileSlot" slot-scope="text">
        <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
        <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
          下载
        </a-button>
      </template>

      <span slot="action" slot-scope="text, record">
        <a @click="handleShowDetail(record)">查看详情</a>
      </span>
    </a-table>

    <StockInModal ref="stockInModal" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import StockInModal from './materialManagement/StockInModal'

export default {
  name: 'StockIn',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    StockInModal
  },
  data() {
    return {
      description: '耗材管理页面',
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
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '入库单号',
          align: 'center',
          dataIndex: 'batchNo'
        },
        {
          title: '仓库名称',
          align: 'center',
          dataIndex: 'warehouseId_dictText'
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status_dictText'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/mission/materialManagement/stock/comeApply/list',
        delete: '/mission/materialManagement/stock/comeApply/delete',
        deleteBatch: '/mission/materialManagement/stock/comeApply/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/stock/comeApply/exportXls',
        importExcelUrl: 'mission/materialManagement/stock/comeApply/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    handleShowDetail(record) {
      this.$refs.stockInModal.show(record)
      this.$refs.stockInModal.title = '查看详情'
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
.btn-group {
  display: flex;
  justify-content: space-evenly;
}
</style>
