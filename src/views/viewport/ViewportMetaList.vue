<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group viewport-list">
          <div class="group">
            <div class="title">任务名称：</div>
            <a-input allowClear v-model="queryParam.taskName" placeholder="请输入名称"></a-input>
          </div>
          <!-- <div class="group">
            <div class="title">性别：</div>
            <a-input allowClear v-model="queryParam.sex" placeholder="请选择性别"></a-input>
          </div> -->
          <!-- <div class="group">
            <div class="title">销售：</div>
            <a-input allowClear v-model="queryParam.sale" placeholder="请选择销售"></a-input>
          </div>
          <div class="group">
            <div class="title">产品：</div>
            <a-input allowClear v-model="queryParam.production" placeholder="请选择产品"></a-input>
          </div>
          <div class="group">
            <div class="title">医院：</div>
            <a-input allowClear v-model="queryParam.hos" placeholder="请选择医院"></a-input>
          </div>
          <div class="group">
            <div class="title">状态：</div>
            <a-input allowClear v-model="queryParam.status" placeholder="请选择"></a-input>
          </div> -->
          <a-button @click="resetQuery" type="primary">重置</a-button>
          <a-button @click="searchQuery" type="primary">搜索</a-button>
          <!-- <a-button @click="handleDetail" type="primary">详情</a-button> -->
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <!-- <div class="table-operator">
      <a-button @click="handleShowViewportUploadModal" type="primary" icon="plus">影像上传</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('产品订单元数据信息')">导出Excel</a-button>
    </div> -->

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

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
    </div>

    <ViewportUploadModal ref="viewportUploadModal" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import '@/assets/less/TableExpand.less'
import ViewportUploadModal from './modules/ViewportUploadModal.vue'

export default {
  name: 'ViewportMetaList',
  mixins: [JeecgListMixin],
  components: {
    ViewportUploadModal
  },
  data() {
    return {
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
          title: '任务名称',
          align: 'center',
          dataIndex: 'taskName'
        },
        {
          title: 'OSS地址',
          align: 'center',
          dataIndex: 'ossKey'
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
        // {
        //   title: '订单号',
        //   align: 'center',
        //   dataIndex: 'orderId'
        // },
        // {
        //   title: '住院号',
        //   align: 'center',
        //   dataIndex: 'sampleNo'
        // },
        // {
        //   title: '姓名',
        //   align: 'center',
        //   dataIndex: 'name'
        // },
        // {
        //   title: '性别',
        //   align: 'center',
        //   dataIndex: 'sex'
        // },
        // {
        //   title: '年龄',
        //   align: 'center',
        //   dataIndex: 'age'
        // },
        // {
        //   title: '检查日期',
        //   align: 'center',
        //   dataIndex: 'createTime'
        // },
        // {
        //   title: '检查时间',
        //   align: 'center',
        //   dataIndex: 'updateTime'
        // },
        // {
        //   title: '影像号',
        //   align: 'center',
        //   dataIndex: 'productRecognition'
        // },
        // {
        //   title: '层厚(mm)',
        //   align: 'center',
        //   dataIndex: 'status'
        // },
        // {
        //   title: '序列数',
        //   align: 'center',
        //   dataIndex: 'gstatus'
        // },
        // {
        //   title: '总帧数',
        //   align: 'center',
        //   dataIndex: 'dstatus'
        // },

        // {
        //   title: '疑似结节数',
        //   align: 'center',
        //   dataIndex: 'cancerType'
        // },
        // {
        //   title: '疑似恶性结节数',
        //   align: 'center',
        //   dataIndex: 'sendDoctor'
        // },
        // {
        //   title: '备注',
        //   align: 'center',
        //   dataIndex: 'companyId'
        // },
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
        list: 'multiomics/medicalImage/job/list'
        // delete: '/multiomics/productOrderMeta/delete',
        // deleteBatch: '/multiomics/productOrderMeta/deleteBatch',
        // exportXlsUrl: '/multiomics/productOrderMeta/exportXls',
        // importExcelUrl: 'multiomics/productOrderMeta/importExcel'
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
    getData() {
      const data = {
        medicalCaseNo: 'case-00000001',
        sendDepartment: 'A02A01',
        sendDoctor: '上海肺科李医生',
        receiveAgencyCode: 'A03',
        updateTime: null,
        createBy: 'admin',
        sendAgencyCode: 'A02',
        createTime: '2021-09-15 14:39:37',
        updateBy: null,
        productRecognition: 'FEI_PAN_AN',
        sysOrgCode: 'A01',
        id: '1438029719336501249',
        cancerType: 'L',
        lastEditStep: 'basic',
        currentState: 'TEMP_ORDER'
      }
    },
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
    resetQuery() {
      this.queryParam = {}
      this.loadData()
    },
    handleShowDetail(record) {
      this.$router.push({
        path: `/viewport/patientsList?archiveJobId=${record.id}`
      })
    },
    handleShowViewportUploadModal() {
      this.$refs.viewportUploadModal.show()
    }
  }
}
</script>
<style lang="less" scoped>
.viewport-list {
  padding-left: 12px;
  .group {
    .title {
      width: 50px;
      flex: 0 0 72px;
    }
  }
}
</style>
