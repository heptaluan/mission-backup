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

    <factory-manage-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></factory-manage-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import FactoryManageModal from './modules/FactoryManageModal'

export default {
  name: 'FactoryManageList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    FactoryManageModal,
  },
  data() {
    return {
      description: '供应商管理管理页面',
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
          title: '供应商编码',
          align: 'center',
          dataIndex: 'factoryCode',
        },
        {
          title: '供应商名称',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '供应商联系人',
          align: 'center',
          dataIndex: 'contactId',
        },
        {
          title: '供应商地址',
          align: 'center',
          dataIndex: 'adress',
        },
        {
          title: '供应商类别',
          align: 'center',
          dataIndex: 'factoryType',
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
        list: '/mission/factoryManage/list',
        delete: '/mission/factoryManage/delete',
        deleteBatch: '/mission/factoryManage/deleteBatch',
        exportXlsUrl: '/mission/factoryManage/exportXls',
        importExcelUrl: 'mission/factoryManage/importExcel',
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
        value: 'factoryCode',
        text: '供应商编码',
        dictCode: '',
      })
      fieldList.push({
        type: 'string',
        value: 'name',
        text: '供应商名称',
        dictCode: '',
      })
      fieldList.push({
        type: 'string',
        value: 'contactId',
        text: '供应商联系人',
        dictCode: '',
      })
      fieldList.push({
        type: 'string',
        value: 'adress',
        text: '供应商地址',
        dictCode: '',
      })
      fieldList.push({
        type: 'string',
        value: 'factoryType',
        text: '供应商类别',
        dictCode: '',
      })
      this.superFieldList = fieldList
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
