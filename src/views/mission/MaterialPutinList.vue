<template>
  <a-card :bordered="false">
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
        <a @click="handleEdit(record)">编辑</a>

        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="handleDetail(record)">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a-popconfirm
                title="确定删除吗?"
                @confirm="() => handleDelete(record.id)"
              >
                <a>删除</a>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>

    <material-putin-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></material-putin-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MaterialPutinModal from './modules/MaterialPutinModal'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'MaterialPutinList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    MaterialPutinModal,
  },
  data() {
    return {
      description: '耗材入库管理管理页面',
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
          title: '耗材ID',
          align: 'center',
          dataIndex: 'materialId',
        },
        {
          title: '耗材名称',
          align: 'center',
          dataIndex: 'materialName',
        },
        {
          title: '批次',
          align: 'center',
          dataIndex: 'batchNo',
        },
        {
          title: '快递单号',
          align: 'center',
          dataIndex: 'emsNo',
        },
        {
          title: '签收人',
          align: 'center',
          dataIndex: 'signInId',
        },
        {
          title: '入库数量',
          align: 'center',
          dataIndex: 'maNumbers',
        },
        {
          title: '仓库',
          align: 'center',
          dataIndex: 'warehouseId_dictText',
        },
        {
          title: '入库时间',
          align: 'center',
          dataIndex: 'putinTime',
          customRender: function (text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          },
        },
        {
          title: '入库状态',
          align: 'center',
          dataIndex: 'piStatus',
        },
        {
          title: '审核时间',
          align: 'center',
          dataIndex: 'auditTime',
          customRender: function (text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          },
        },
        {
          title: '审核人',
          align: 'center',
          dataIndex: 'auditId',
        },
        {
          title: '所属项目',
          align: 'center',
          dataIndex: 'projectId_dictText',
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
        list: '/mission/materialPutin/list',
        delete: '/mission/materialPutin/delete',
        deleteBatch: '/mission/materialPutin/deleteBatch',
        exportXlsUrl: '/mission/materialPutin/exportXls',
        importExcelUrl: 'mission/materialPutin/importExcel',
      },
      dictOptions: {},
      superFieldList: [],
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({
        type: 'string',
        value: 'materialId',
        text: '耗材ID',
        dictCode: '',
      })
      fieldList.push({
        type: 'string',
        value: 'materialName',
        text: '耗材名称',
        dictCode: '',
      })
      fieldList.push({
        type: 'string',
        value: 'batchNo',
        text: '批次',
        dictCode: '',
      })
      fieldList.push({
        type: 'string',
        value: 'emsNo',
        text: '快递单号',
        dictCode: '',
      })
      fieldList.push({
        type: 'string',
        value: 'signInId',
        text: '签收人',
        dictCode: '',
      })
      fieldList.push({
        type: 'int',
        value: 'maNumbers',
        text: '入库数量',
        dictCode: '',
      })
      fieldList.push({
        type: 'string',
        value: 'warehouseId',
        text: '仓库',
        dictCode: 'warehouse_manage,name,id',
      })
      fieldList.push({ type: 'date', value: 'putinTime', text: '入库时间' })
      fieldList.push({
        type: 'int',
        value: 'piStatus',
        text: '入库状态',
        dictCode: '',
      })
      fieldList.push({ type: 'date', value: 'auditTime', text: '审核时间' })
      fieldList.push({
        type: 'string',
        value: 'auditId',
        text: '审核人',
        dictCode: '',
      })
      fieldList.push({
        type: 'string',
        value: 'projectId',
        text: '所属项目',
        dictCode: 'project_info,project_name,id',
      })
      this.superFieldList = fieldList
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
