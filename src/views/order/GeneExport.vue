<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <div class="group">
            <div class="title">批次号：</div>
            <a-input allowClear v-model="queryParam.batchId" placeholder="请输入名称"></a-input>
          </div>
          <div class="group">
            <div class="title">状态：</div>
            <a-input allowClear v-model="queryParam.status" placeholder="请选择"></a-input>
          </div>
          <div class="group">
            <div class="title">导出人：</div>
            <a-input allowClear v-model="queryParam.sale" placeholder="请选择导出人"></a-input>
          </div>
          <div class="group">
            <div class="title">导出时间：</div>
            <j-date
              v-model="queryParam.createTime_begin"
              :showTime="true"
              date-format="YYYY-MM-DD HH:mm:ss"
              style="width:45%"
              placeholder="请选择开始时间"
            ></j-date>
            <span style="width: 10px;">-</span>
            <j-date
              v-model="queryParam.createTime_end"
              :showTime="true"
              date-format="YYYY-MM-DD HH:mm:ss"
              style="width:45%"
              placeholder="请选择结束时间"
            ></j-date>
          </div>
          <a-button @click="resetQuery" type="primary">重置</a-button>
          <a-button @click="searchQuery" type="primary">搜索</a-button>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExportXls('基因导出记录')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query
        v-if="false"
        :fieldList="superFieldList"
        ref="superQueryModal"
        @handleSuperQuery="handleSuperQuery"
      ></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{ x: true }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleView(record)" class="margin-right-xs">查看明细</a>
          <a @click="handleEdit(record)">编辑表单</a>
        </span>
      </a-table>
    </div>

    <GeneExportModal ref="modalForm" @ok="modalFormOk" @close="modalFormClose" />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import GeneExportModal from './modules/GeneExportModal'
import '@/assets/less/TableExpand.less'

export default {
  name: 'GeneExport',
  mixins: [JeecgListMixin],
  components: {
    GeneExportModal
  },
  data() {
    return {
      description: '基因导出记录',
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
          title: '批次号',
          align: 'center',
          dataIndex: 'batchId'
        },
        {
          title: '批次数量',
          align: 'center',
          dataIndex: 'batchCount'
        },
        {
          title: '导出人',
          align: 'center',
          dataIndex: 'sampleNo'
        },
        {
          title: '导出时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 240,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/multiomics/productOrder/list',
        delete: '/multiomics/productOrderMeta/delete',
        deleteBatch: '/multiomics/productOrderMeta/deleteBatch',
        exportXlsUrl: '/multiomics/productOrderMeta/exportXls',
        importExcelUrl: 'multiomics/productOrderMeta/importExcel'
      },
      dictOptions: {},
      superFieldList: []
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    initDictConfig() {},
    getData() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'sampleNo', text: '样本编号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'productId', text: '产品', dictCode: '' })
      fieldList.push({ type: 'string', value: 'companyId', text: '送检单位', dictCode: '' })
      fieldList.push({ type: 'string', value: 'cancerType', text: '癌种', dictCode: '' })
      fieldList.push({ type: 'string', value: 'emsId', text: '快递公司', dictCode: '' })
      fieldList.push({ type: 'string', value: 'emsNo', text: '快递单号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'deliveryAddressId', text: '收件地址', dictCode: '' })
      fieldList.push({ type: 'string', value: 'sendDepartment', text: '送检科室', dictCode: '' })
      fieldList.push({ type: 'string', value: 'sendDoctor', text: '送检医生', dictCode: '' })
      this.superFieldList = fieldList
    },
    handleView(record) {
      // this.$router.push({name:'orderDetail', params: { id: record.id}})
    },
    resetQuery() {
      this.queryParam = {}
    },
    modalFormClose() {
      // 当用户关闭时候 也刷新列表
      this.modalFormOk()
    }
  }
}
</script>
<style lang="less">
.search-group {
  padding-left: 12px;
  .group {
    .title {
      width: 50px;
      flex: 0 0 50px;
    }
  }
}
</style>
