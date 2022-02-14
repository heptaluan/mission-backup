<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <a-col class="group sm">
            <a-form-item label='渠道商:' :labelCol='{ span: 6 }'>
              <a-select v-model='queryParam.sendAccess' placeholder='请选择渠道商'
                        allowClear
                        show-search
                        :value='channelValue'
                        :default-active-first-option='false'
                        :filter-option='false'
                        :not-found-content='null'
                        @search='handleChannelSearch'
                        @change='handleChannelChange'>
                <a-select-option v-for='item in distributorList' :key='item.id' :value='item.shortName'>
                  {{ item.accessName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class='group md'>
            <a-form-item label='医院:' :labelCol='{ span: 5 }'>
              <a-select v-model='queryParam.sendHospital' placeholder='请选择医院'>
                <a-select-option v-for='item in hospitalList' :key='item.id' :value='item.shortName' allowClear>
                  {{ item.hospitalName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group sm">
            <a-form-item label="姓名:" :labelCol="{ span: 5 }">
              <a-input allowClear v-model="queryParam.name" placeholder="请输入姓名"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group sm">
            <a-form-item label="审核:" :labelCol="{ span: 5 }">
              <a-select v-model="queryParam.checkType" placeholder="请选择是否审核" allowClear default-value="0">
                <a-select-option v-for="(item, index) in checkOption" :key="index" :value="item.value">
                  {{item.label}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group tiny">
            <a-form-item label="性别:" :labelCol="{ span: 5 }">
              <a-select v-model="queryParam.sex" placeholder="请选择性别" allowClear>
                <a-select-option v-for="item in genderOption" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group sm">
            <a-form-item label="身份证:" :labelCol="{ span: 6 }">
              <a-input allowClear v-model="queryParam.idCard" placeholder="请输入身份证"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group sm" v-if="false">
            <a-form-item label="手机号:" :labelCol="{ span: 6 }">
              <a-input allowClear v-model="queryParam.phone" placeholder="请输入手机号"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="报告时间" :labelCol="{ span: 5 }">
              <j-date
                v-model="queryParam.createTime_begin"
                :showTime="true"
                date-format="YYYY-MM-DD"
                placeholder="请选择开始时间"
              ></j-date>
              <span style="width: 20px;"> - </span>
              <j-date
                v-model="queryParam.createTime_end"
                :showTime="true"
                date-format="YYYY-MM-DD"
                placeholder="请选择结束时间"
              ></j-date>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col class="group sm">
              <a-form-item label="报告状态">
                <a-input placeholder="请选择报告状态" v-model="queryParam.reportType"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col class="group sm">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <!-- <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('初始报告结果')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div> -->

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

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
        <template slot="tags" slot-scope="checkType">
          <a-tag :color="checkType === 1 ?  '#87d068': '#2db7f5'">{{checkType === 1 ? '已经审核': '未审核'}}</a-tag>
        </template>
        <template slot="colorText" slot-scope="text">
          <span v-html="text" :style="calcStyle(text)"></span>
        </template>
        <template slot="colorTextImage" slot-scope="text">
          <span v-html="text" :style="calcStyleImage(text)"></span>
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
          <a @click="handleDetail(record)">详情</a>
          <!--           <a-divider type="vertical" />-->
          <!--          <a @click="handleDetail(record)">详情</a>-->

          <!--
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
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
  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { selectorFilterMixin } from '@/mixins/selectorFilterMixin'

  export default {
    name: 'SampleReportCheckList',
    mixins: [JeecgListMixin, mixinDevice, selectorFilterMixin],
    data() {
      return {
        description: '初始报告结果管理页面',
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
            title: '渠道商',
            align: 'center',
            dataIndex: 'sendAccess_dictText'
          },
          {
            title: '医院',
            align: 'center',
            dataIndex: 'sendHospital_dictText'
          },
          {
            title: '姓名',
            align: 'center',
            dataIndex: 'name'
          },
          {
            title: '年龄',
            align: 'center',
            dataIndex: 'age'
          },
          {
            title: '性别',
            align: 'center',
            dataIndex: 'sex',
            customRender: function(t, r, index) {
              let text = '-'
              if (t === '0') {
                text = '女'
              }
              if (t === '1') {
                text = '男'
              }
              return text
            }
          },
          // {
          //   title: '手机号',
          //   align: 'center',
          //   dataIndex: 'phone'
          // },
          {
            title: '产品',
            align: 'center',
            dataIndex: 'choseProduct_dictText',

          },
          {
            title: '身份证',
            align: 'center',
            dataIndex: 'idCard'
          },
          {
            title: '代谢结果',
            align: 'center',
            dataIndex: 'ananpanReportValue',
            key: 'ananpanReportValue',
            scopedSlots: { customRender: 'colorText' },
          },
          {
            title: '影像结果',
            align: 'center',
            dataIndex: 'imageReportValue',
            key: 'imageReportValue',
            scopedSlots: { customRender: 'colorTextImage' },
          },
          {
            title: '表观结果',
            align: 'center',
            dataIndex: 'geneReportValue',
            key: 'geneReportValue',
            scopedSlots: { customRender: 'colorTextImage' },
          },
          {
            title: '报告总结果',
            align: 'center',
            dataIndex: 'reportValue',
            key: 'reportValue',
            scopedSlots: { customRender: 'colorText' },
          },
          {
            title: '状态',
            align: 'center',
            key: 'checkType',
            dataIndex: 'checkType',
            scopedSlots: { customRender: 'tags' },
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
                <div>剩余完<br />成时间</div>
              )
            },
            align: 'center',
            dataIndex: 'time',
            customRender: function(t, r) {
              if (r.planCompletionTime) {
                const currentTime = new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1).toString() + '-' + (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()).toString()
                const startTime = new Date(r.planCompletionTime)
                const endTime = new Date(currentTime)
                const diffTime = (startTime - endTime) / (1000 * 60 * 60 * 24)
                return diffTime + '天'
              } else {
                return '-'
              }
            }
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
            title: '备注',
            align: 'center',
            dataIndex: 'remark'
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
          list: '/report/sampleReportSource/sList',
          delete: '/report/sampleReportSource/delete',
          deleteBatch: '/report/sampleReportSource/deleteBatch',
          exportXlsUrl: '/report/sampleReportSource/exportXls',
          importExcelUrl: 'report/sampleReportSource/importExcel'
        },
        dictOptions: {},
        superFieldList: [],
        hospitalList: [],
        distributorList: [],
        checkOption: [
          { label: '已审核', value: 1 },
          { label: '未审核', value: 0 },
          { label: '全部', value: '' }
        ],
        isorter: {
          column: 'reportType, planCompletionTime',
          order: 'asc'
        },
        ipagination: {
          pageSize: 50,
          pageSizeOptions: ['20', '50', '100'],
        },
        channelValue: null,
        disableMixinCreated: false
      }
    },
    created() {
      this.loadDistributorList()
      this.getSuperFieldList()
      this.loadData()
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }
    },
    methods: {
      initDictConfig() {},
      getSuperFieldList() {
        let fieldList = []
        fieldList.push({ type: 'double', value: 'ananpanReportValue', text: '代谢结果', dictCode: '' })
        fieldList.push({ type: 'Text', value: 'ananpanReportAll', text: '代谢总览', dictCode: '' })
        fieldList.push({ type: 'date', value: 'ananpanTime', text: '代谢报告时间' })
        fieldList.push({ type: 'double', value: 'imageReportValue', text: '影像结果', dictCode: '' })
        fieldList.push({ type: 'Text', value: 'imageReportAll', text: '影像结果总览', dictCode: '' })
        fieldList.push({ type: 'date', value: 'imageTime', text: '影像报告时间' })
        fieldList.push({ type: 'double', value: 'geneReportValue', text: '基因结果', dictCode: '' })
        fieldList.push({ type: 'Text', value: 'geneReportAll', text: '基因结果总览', dictCode: '' })
        fieldList.push({ type: 'date', value: 'geneTime', text: '基因结果时间' })
        fieldList.push({ type: 'int', value: 'reportValue', text: '报告总结果', dictCode: '' })
        fieldList.push({ type: 'int', value: 'reportType', text: '报告状态', dictCode: '' })
        fieldList.push({ type: 'Text', value: 'remark', text: '备注', dictCode: '' })
        fieldList.push({ type: 'string', value: 'orderId', text: '订单编号', dictCode: '' })
        this.superFieldList = fieldList
      },
      handleDetail (record) {
        // /reportDetail
        this.$router.push({name: 'ReportCheckDetail', params: {
            id: record.id
          }})
      },
      handleCheckChange(value) {
        this.$set(this.queryParam, 'checkType', value)
      },
      calcStyle(text) {
        let bgColor = '#fff'
        let Color = '#000'
        const sore = parseFloat(text)
        if (sore >= 50 && sore < 70) {
          Color = '#fff'
          bgColor = '#faad14'
        }
        if (sore >= 70) {
          Color = '#fff'
          bgColor = '#f5222d'
        }
        return `background-color: ${bgColor}; color: ${Color}`
      },
      calcStyleImage(text) {
        let bgColor = '#fff'
        let Color = '#000'
        const sore = parseFloat(text)
        if (sore >= 60) {
          Color = '#fff'
          bgColor = '#f5222d'
        }
        return `background-color: ${bgColor}; color: ${Color}`
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
