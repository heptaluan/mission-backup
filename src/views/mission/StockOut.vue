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

    <!-- 出库表单 -->
    <StockOutModal ref="stockOutModal" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import StockOutModal from './materialManagement/StockOutModal'

export default {
  name: 'StockOut',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    StockOutModal
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
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'projectId_dictText'
        },
        {
          title: '仓库',
          align: 'center',
          dataIndex: 'warehouseId_dictText'
        },
        {
          title: '合作机构',
          align: 'center',
          dataIndex: 'leaveTarget_dictText'
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
          title: '病例数',
          align: 'center',
          dataIndex: 'caseAmount'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark'
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
        list: '/mission/materialManagement/stock/leaveApply/list',
        delete: '/mission/materialManagement/stock/leaveApply/delete',
        deleteBatch: '/mission/materialManagement/stock/leaveApply/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/stock/leaveApply/exportXls',
        importExcelUrl: 'mission/materialManagement/stock/leaveApply/importExcel'
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
      this.$refs.stockOutModal.show(record)
      this.$refs.stockOutModal.title = '查看详情'
    }
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
