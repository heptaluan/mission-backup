<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group order-list">
          <div class="group">
            <div class="title">病例编号：</div>
            <a-input allowClear v-model="queryParam.medicalCaseCode" placeholder="请输入病例编号"></a-input>
          </div>
          <div class="group">
            <div class="title">产品名称：</div>
            <a-select style="width:200px;" v-model="queryParam.productRecognition" placeholder="请选择产品">
              <a-select-option v-for="item in productInfoList" :key="item.id" :value="item.productRecognition">
                {{ item.productName }}
              </a-select-option>
            </a-select>
          </div>
          <div class="group">
            <div class="title">病人姓名：</div>
            <a-input allowClear v-model="queryParam.caseName" placeholder="请输入病人姓名"></a-input>
          </div>
          <div class="group">
            <div class="title">身份证号：</div>
            <a-input allowClear v-model="queryParam.identityNumber" placeholder="请输入身份证号"></a-input>
          </div>
          <!-- <div class="group">
            <div class="title">性别：</div>
            <a-input allowClear v-model="queryParam.sex" placeholder="请选择性别"></a-input>
          </div>
          <div class="group">
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
          </div> -->
          <a-button @click="resetQuery" type="primary">重置</a-button>
          <a-button @click="searchQuery" type="primary">搜索</a-button>
          <!--          <a-button @click="handleDetail" type="primary">详情</a-button>-->
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="addNewOrder" type="primary" icon="plus">创建订单</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls()">导出Excel</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls()">导出基因Excel</a-button>
      <!-- <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <j-super-query
        :fieldList="superFieldList"
        ref="superQueryModal"
        @handleSuperQuery="handleSuperQuery"
      ></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown> -->
    </div>

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
        rowKey="index"
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

        <span slot="action" slot-scope="text, record" style="display: flex;justify-content: space-evenly;">
          <a v-if="record.orderState === 1000" @click="editOrder(record)">编辑</a>
          <a v-if="record.orderState !== 1000" @click="handleDetail(record)">详情</a>
          <a-popconfirm
            v-if="record.orderState === 1000"
            title="确定删除吗?"
            @confirm="() => handleDeleteOrder(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>

          <!-- <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item v-if="record">
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import '@/assets/less/TableExpand.less'
import { deleteTempleOrder } from 'src/api/order/index'
import { getProductInfoList } from '../../api/product/index'

export default {
  name: 'ProductOrderMetaList',
  mixins: [JeecgListMixin],
  data() {
    return {
      description: '产品订单元数据信息管理页面',
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
          title: '病例编号',
          align: 'center',
          dataIndex: 'medicalCaseCode'
        },
        {
          title: '产品名称',
          align: 'center',
          dataIndex: 'choseProduct_dictText'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'caseName'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex',
          customRender: function(t, r, index) {
            if (r.gender === 1) {
              return '男'
            } else {
              return '女'
            }
          }
        },
        {
          title: '年龄',
          align: 'center',
          dataIndex: 'age'
        },
        {
          title: '身份份证号',
          align: 'center',
          dataIndex: 'identityNumber'
        },
        {
          title: '销售人员',
          align: 'center',
          dataIndex: 'seller_dictText'
        },
        {
          title: '渠道商',
          align: 'center',
          dataIndex: 'sendAccess_dictText'
        },
        {
          title: '送检医院',
          align: 'center',
          dataIndex: 'sendHospital'
        },
        {
          title: '送检科室',
          align: 'center',
          dataIndex: 'sendDepartment'
        },
        {
          title: '送检医生',
          align: 'center',
          dataIndex: 'sendDoctor'
        },
        {
          title: '订单状态',
          align: 'center',
          dataIndex: 'orderState_dictText'
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
        list: 'multiomics/productOrder/orderUserView',
        exportXlsUrl: 'multiomics/productOrder/exportOrderUserView'
      },
      dictOptions: {},
      superFieldList: [],
      productInfoList: []
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
    handleDetail(record) {
      this.$router.push({ name: 'orderDetail', params: { id: record.id } })
    },
    resetQuery() {
      this.queryParam = {}
      this.loadData()
    },
    modalFormClose() {
      // 当用户关闭时候 也刷新列表
      this.modalFormOk()
    },
    addNewOrder() {
      this.$router.push({
        path: '/orderList/addNewOrder'
      })
    },
    editOrder(record) {
      const step = record.lastEditStep ? record.lastEditStep : 0
      this.$router.push({
        path: `/orderList/editNewOrder?orderId=${record.id}&currentTab=${step}`
      })
    },
    handleDeleteOrder(id) {
      const that = this
      deleteTempleOrder(id).then(res => {
        if (res.code === 200) {
          that.$message.success(res.message)
          this.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    loadProductInfoList() {
      const that = this
      getProductInfoList().then(res => {
        if (res.success) {
          that.productInfoList = res.result.records
          console.log(that.productInfoList)
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  },
  mounted() {
    this.loadProductInfoList()
  },
  watch: {
    $route: {
      immediate: true,
      handler: function(val, oldVal) {
        this.loadData()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.search-group.order-list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;

  .group {
    display: flex;
    justify-items: center;
    align-items: center;
    margin-right: 15px;

    .title {
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
      text-align: right;
      width: 80px;
      flex: 0 0 75px;
    }

    .search-label {
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
      text-align: right;
      min-width: 45px;
    }
  }

  .ant-btn {
    margin-right: 15px;
  }
}
</style>
