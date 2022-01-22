<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group order-list">
          <a-col class="group sm">
            <a-form-item label="病例编号:" :labelCol="{ span: 6 }">
              <a-input allowClear v-model="queryParam.medicalCaseCode" placeholder="请输入病例编号"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group sm">
            <a-form-item label="姓名:" :labelCol="{ span: 6 }">
              <a-input allowClear v-model="queryParam.caseName" placeholder="请输入姓名"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group tiny">
            <a-form-item label="性别:" :labelCol="{ span: 6 }">
              <a-select v-model="queryParam.gender" placeholder="请选择性别" allowClear>
                <a-select-option v-for="item in genderOption" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="渠道商:" :labelCol="{ span: 6 }">
              <a-select
                v-model="queryParam.sendAccess"
                placeholder="请选择渠道商"
                allowClear
                show-search
                :value="channelValue"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleChannelSearch"
                @change="handleChannelChange"
              >
                <a-select-option v-for="item in distributorList" :key="item.id" :value="item.departNameAbbr">
                  {{ item.departName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col class='group md'>
            <a-form-item label='销售:' :labelCol='{ span: 6 }'>
              <a-select
                show-search
                allowClear
                :value='sellValue'
                placeholder='输入关联销售进行检索'
                :default-active-first-option='false'
                :show-arrow='false'
                :filter-option='false'
                :not-found-content='null'
                @search='handleSellSearch'
                @change='handleSellChange'
              >
                <a-select-option v-for='item in sellData' :key='item.id' :value='item.username'>
                  {{ item.realname }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class='group sm'>
            <a-form-item label='产品:' :labelCol='{ span: 6 }'>
              <a-select v-model='queryParam.choseProduct' placeholder='请选择产品' allowClear>
                <a-select-option v-for='item in productInfoList' :key='item.id' :value='item.productRecognition'>
                  {{ item.productName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="医院:" :labelCol="{ span: 6 }">
              <a-select v-model="queryParam.sendHospital" placeholder="请选择医院">
                <a-select-option v-for="item in hospitalList" :key="item.id" :value="item.departNameAbbr">
                  {{ item.hospitalName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col class="group md">
            <a-form-item label="状态:" :labelCol="{ span: 6 }">
              <a-select v-model="queryParam.orderState" placeholder="请选择状态">
                <a-select-option v-for="item in orderStateList" :key="item.id" :value="item.productMilestone">
                  {{ item.productMilestone_dictText }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="订单来源:" :labelCol="{ span: 6 }">
              <a-select v-model="queryParam.sourceType" placeholder="请选择来源">
                <a-select-option v-for="item in orderResource" :key="item.id" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="订单创建时间" :labelCol="{ span: 5 }">
              <j-date
                v-model="queryParam.createTime_begin"
                :showTime="true"
                allowClear
                date-format="YYYY-MM-DD"
                placeholder="请选择开始时间"
              ></j-date>
              <span style="width: 20px;"> - </span>
              <j-date
                v-model="queryParam.createTime_end"
                :showTime="true"
                allowClear
                date-format="YYYY-MM-DD"
                placeholder="请选择结束时间"
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col class="group btn">
            <a-button @click="searchQuery" type="primary">搜索</a-button>
            <a-button @click="resetQuery">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="addNewOrder" type="primary" icon="plus">创建订单</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls(`导出订单列表${currentTime}`)"
        >导出Excel</a-button
      >
      <a-button type="primary" @click="batchImport">批量导入订单</a-button>

      <!-- <a-button type="primary" icon="download" @click="handleExportXls(`导出基因订单列表${currentTime}`)">导出基因Excel</a-button> -->
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
        <!--        <template slot="check" slot-scope="text">-->
        <!--          <span v-if="!text">-->
        <!--            <a-icon type="check" />-->
        <!--          </span>-->
        <!--        </template>-->
        <!--        <template slot="imgSlot" slot-scope="text">-->
        <!--          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>-->
        <!--          <img-->
        <!--            v-else-->
        <!--            :src="getImgView(text)"-->
        <!--            height="25px"-->
        <!--            alt=""-->
        <!--            style="max-width:80px;font-size: 12px;font-style: italic;"-->
        <!--          />-->
        <!--        </template>-->
        <!--        <template slot="fileSlot" slot-scope="text">-->
        <!--          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>-->
        <!--          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">-->
        <!--            下载-->
        <!--          </a-button>-->
        <!--        </template>-->
        <span slot="action" slot-scope="text, record" style="display: flex;justify-content: space-evenly;">
          <a v-if="record.orderState === 1000" @click="editOrder(record)">编辑</a>
          <a v-if="record.orderState !== 1000" @click="handleDetail(record)">详情</a>
          <a-popconfirm
            v-if="record.orderState === 1000 || !record['isAnyStatus']"
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
    <order-batch-import-modal ref="orderBatchImportModal" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import '@/assets/less/TableExpand.less'
import { deleteTempleOrder } from 'src/api/order/index'
import {
  getHospitalList,
  getProductInfoList,
  getDistributorAllList,
  productAnalysisStepRelation
} from '../../api/product/index'
import { queryRoleUsers } from '../../api/material'
import { CommonSingleUpload, startOrderImportTask } from 'src/api/order/index'
import OrderBatchImportModal from './modules/orderBatchImportModal'
import { selectorFilterMixin } from '@/mixins/selectorFilterMixin'

function sellFetch(value, callback) {
  let timeout
  let currentValue

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  function fake() {
    queryRoleUsers({
      role: 'sales_omics',
      name: value
    }).then(res => {
      if (res.success) {
        if (currentValue === value) {
          const result = res.result
          const data = []
          result.forEach(r => {
            data.push({
              key: r.id,
              realname: r.realname,
              username: r.username,
              id: r.id
            })
          })
          callback(data)
        }
      } else {
        console.log(res.message)
      }
    })
  }

  timeout = setTimeout(fake, 300)
}

export default {
  name: 'ProductOrderMetaList',
  mixins: [JeecgListMixin, selectorFilterMixin],
  components: {
    OrderBatchImportModal
  },
  data() {
    return {
      description: '产品订单元数据信息管理页面',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          fixed: 'left',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '病例编号',
          align: 'center',
          dataIndex: 'medicalCaseCode',
          fixed: 'left',
          width: 140,
          sorter: (a, b) => a.medicalCaseCode - b.medicalCaseCode,
          medicalCaseCode: ['descend', 'ascend']
        },
        {
          title: '姓名',
          align: 'center',
          width: 140,
          dataIndex: 'caseName',
          fixed: 'left'
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
          dataIndex: 'age',
          sorter: (a, b) => a.age - b.age
        },
        {
          title: '产品',
          align: 'center',
          dataIndex: 'choseProduct_dictText'
        },
        // {
        //   title: '身份份证号',
        //   align: 'center',
        //   dataIndex: 'identityNumber'
        // },
        // {
        //   title: '销售人员',
        //   align: 'center',
        //   dataIndex: 'seller_dictText'
        // },
        {
          title: '渠道商',
          align: 'center',
          dataIndex: 'sendAccess_dictText'
        },
        {
          title: '医院',
          align: 'center',
          dataIndex: 'sendHospital_dictText'
        },
        // {
        //   title: '送检科室',
        //   align: 'center',
        //   dataIndex: 'sendDepartment'
        // },
        // {
        //   title: '送检医生',
        //   align: 'center',
        //   dataIndex: 'sendDoctor'
        // },
        {
          title: '表观组',
          children: []
        },
        {
          title: '代谢组',
          children: []
        },
        {
          title: '影像组',
          children: []
        },
        {
          title: '订单报告',
          children: [
            {
              title: '生成',
              align: 'center',
              dataIndex: 'bgsc'
            },
            {
              title: '审核',
              align: 'center',
              dataIndex: 'bgsh'
            }
          ]
        },
        {
          title: '预计完成时间',
          align: 'center',
          dataIndex: 'planCompletionTime'
        },
        {
          title: '实际完成时间',
          align: 'center',
          dataIndex: 'actualCompletionTime'
        },
        {
          title: () => {
            return (
              <div>
                剩余完
                <br />
                成时间
              </div>
            )
          },
          align: 'center',
          dataIndex: 'time',
          customRender: function(t, r) {
            const currentTime =
              new Date().getFullYear().toString() +
              '-' +
              (new Date().getMonth() + 1 < 10
                ? '0' + (new Date().getMonth() + 1)
                : new Date().getMonth() + 1
              ).toString() +
              '-' +
              (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()).toString()
            const startTime = new Date(r.planCompletionTime)
            const endTime = new Date(currentTime)
            const diffTime = (startTime - endTime) / (1000 * 60 * 60 * 24)
            return diffTime + '天'
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.createTime - b.createTime,
          medicalCaseCode: ['descend', 'ascend']
        },
        // {
        //   title: '完成时间',
        //   align: 'center',
        //   dataIndex: 'completeTime'
        // },
        {
          title: '订单状态',
          align: 'center',
          dataIndex: 'orderState_dictText'
        },
        {
          title: '来源',
          align: 'center',
          dataIndex: 'sourceType',
          customRender: function(text) {
            if (text === 0) {
              return '门诊'
            } else if (text === 1) {
              return '商检'
            } else if (text === 2) {
              return '科研'
            } else {
              return ''
            }
          }
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
      superFieldList: [],
      productInfoList: [],
      hospitalList: [],
      distributorList: [],
      channelValue: undefined,
      user: null,
      sellData: [],
      sellValue: undefined,
      orderStateList: [
        { productMilestone_dictText: '临时订单', productMilestone: 1000 },
        { productMilestone_dictText: '正式订单', productMilestone: 3000 },
        { productMilestone_dictText: '报告制作', productMilestone: 7000 },
        { productMilestone_dictText: '报告审核', productMilestone: 9000 }
      ],
      currentTime: '',
      orderResource: [
        { key: 0, value: '门诊' },
        { key: 1, value: '商检' },
        { key: 2, value: '科研' }
      ]
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
      this.sellValue = undefined
      this.loadDistributorList()
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
          // console.log(that.productInfoList)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleUploadList() {
      console.log(`批量上传`)
    },
    batchImport(record) {
      this.$refs.orderBatchImportModal.show(record)
    },
    getCurrentTime() {
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1 < 10 ? '0' + new Date().getMonth() + 1 : new Date().getMonth() + 1
      let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
      let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      yy = yy.toString()
      mm = mm.toString()
      dd = dd.toString()
      hh = hh.toString()
      mf = mf.toString()
      ss = ss.toString()
      this.currentTime = yy + mm + dd + hh + mf + ss
    },
    handleSellSearch(value) {
      if (!(this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics'))) {
        sellFetch(value, data => (this.sellData = data))
      }
    },
    handleSellChange(value) {
      this.sellValue = value
      if (!(this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics'))) {
        sellFetch(value, data => (this.sellData = data))
      }
      this.$set(this.queryParam, 'sendAccess', undefined) // clean the previous data if the sellUser or sellUserId changed
      this.$set(this.queryParam, 'sendHospital', undefined) // clean the previous data if the sellUser or sellUserId changed
      this.loadHospitalList()
      if (value) {
        this.queryParam.seller = value
        this.loadDistributorList(null, value)
      } else {
        this.loadDistributorList()
      }
    },
    statusBackground(record) {
      return {
        style:
          record.orderState_dictText === '报告完结'
            ? {
                'background-color': 'green',
                color: 'white'
              }
            : {}
      }
    },
    beforeUpload(file) {
      const that = this
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      if (!isExcel) {
        this.$message.error('只能上传 Excel 文件!')
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('文件大小必须小于 10MB!')
      }
      this.currentFile = file
      return isExcel && isLt10M
    },
    handleUpload(file) {
      const that = this
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('code', '4000')
      CommonSingleUpload(formData)
        .then(res => {
          if (res.success) {
            that.$message.success(res.message)
            const id = res.result.id
            startOrderImportTask({
              fileInfo: id
            }).then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$router.push({
                  path: `/order/orderHistory`
                })
              } else {
                that.$message.error(res.message)
              }
            })
          } else {
            that.$message.error(res.message)
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    checkMark(category, stepValue, record) {
      for (let i = 0; i < record['omicsOrders'].length; i++) {
        if (category == record['omicsOrders'][i].omicsAnalysisType) {
          // the state of order should be larger than the step value of cell, then the icon will show up
          if (record['omicsOrders'][i]['orderState'] >= stepValue) {
            record['isAnyStatus'] = true
            return <a-icon type="check-circle" class="green" />
          }
        }
      }
    },
    loadProductAnalysisStepRelation() {
      productAnalysisStepRelation()
        .then(res => {
          const stepRelation = res.result['FK']
          const columnTitles = ['表观组', '代谢组', '影像组']
          let insertTableItem = {}
          const that = this
          Object.keys(stepRelation).forEach(field => {
            insertTableItem[field] = {}
            insertTableItem[field]['title'] = columnTitles[field]
            insertTableItem[field]['list'] = []
            // connect the omics columns with dictionary
            for (let i = 0; i < that.columns.length; i++) {
              if (that.columns[i].title == insertTableItem[field]['title']) {
                that.columns[i].children = insertTableItem[field]['list']
              }
            }
            // set the mark check method of omics columns' cells
            for (let i = 0; i < stepRelation[field].length; i++) {
              insertTableItem[field]['list'][i] = {
                title: stepRelation[field][i]['stepDictText'],
                align: 'center',
                dataIndex: stepRelation[field][i]['omicsStep'] + stepRelation[field][i]['omics'],
                customRender: (t, r) =>
                  this.checkMark(stepRelation[field][i]['omics'], stepRelation[field][i]['omicsStep'], r)
              }
            }
          })
        })
        .catch(e => {
          console.log(e)
        })
    }
  },
  mounted() {
    this.user = this.$store.state.user.info
    this.loadHospitalList()
    this.loadProductInfoList()
    this.loadProductAnalysisStepRelation()
    this.loadDistributorList()
    this.getCurrentTime()
    if (this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics')) {
      this.sellData = [this.user]
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function(val, oldVal) {
        if (this.$route.query.importTaskId) {
          this.queryParam.importTaskId = this.$route.query.importTaskId
          this.searchQuery()
          history.pushState({}, '', '/order/orderList')
        } else {
          this.loadData()
        }
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
  margin-bottom: 0;

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
      flex: 0 0 100px;
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
.green {
  color: #00db00;
  /deep/ svg {
    font-size: 20px;
  }
}
</style>
