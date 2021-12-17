<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <a-col class="group md">
            <a-form-item label="耗材订单编号" >
              <a-input
                allowClear
                v-model="queryParam.leaveApplyId"
                placeholder="请输入耗材订单编号"
                @change="onChange"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="创建时间">
              <j-date
                v-model="queryParam.updateTime_begin"
                :showTime="true"
                date-format="YYYY-MM-DD"
                placeholder="请选择开始时间"
              ></j-date>
              <span style="width: 10px;"> - </span>
              <j-date
                v-model="queryParam.updateTime_end"
                :showTime="true"
                c
                placeholder="请选择结束时间"
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="销售:" :labelCol="{ span: 6 }">
              <a-select
                show-search
                :value="sellValue"
                placeholder="输入关联销售进行检索"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSellSearch"
                @change="handleSellChange"
              >
                <a-select-option v-for="item in sellData" :key="item.id" :value="item.username">
                  {{ item.realname }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="客户" prop="sendAccess" class="order-label">
              <a-select style="width:200px;" v-model="queryParam.agencyId" placeholder="请选择客户">
                <a-select-option v-for="item in distributorList" :key="item.id" :value="item.shortName">
                  {{ item.accessName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group btn">
            <a-button @click="searchQuery" type="primary">查询</a-button>
            <a-button @click="resetQuery">重置</a-button>
          </a-col>
          <!-- <div class="group">
            <div class="title">项目：</div>
            <j-dict-select-tag v-model="queryParam.projectId" dictCode="project_info, project_name, id, logical_state=1" placeholder="请选择项目组" style="width: 180px"></j-dict-select-tag>
          </div> -->
        </a-row>
      </a-form>
    </div>
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
        <div class="btn-group" v-if="record.circuitResult === 10000" style="display: flex;">
          <a @click="preview(record)">查看</a>
          <a @click="downloadCode(record)" v-has="'codeEdit'">下载编号</a>
        </div>
      </span>
    </a-table>

    <CodeControlModal ref="codeControlModal" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixinForMount'
import CodeControlModal from './modules/sample/CodeControlModal'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { queryRoleUsers } from '../../api/material'
import { getDistributorList } from '../../api/product/index'

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
  name: 'CodeControl',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    CodeControlModal
  },
  data() {
    return {
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
          title: '耗材订单编号',
          align: 'center',
          dataIndex: 'leaveApplyId'
        },
        {
          title: '客户',
          align: 'center',
          dataIndex: 'agencyId_dictText'
        },
        {
          title: '编号数量',
          align: 'center',
          dataIndex: 'codeAmount',
          customRender: function(t, r, index) {
            if (r.circuitResult !== 10000) {
              return '-'
            } else {
              return t
            }
          }
        },
        {
          title: '病例数量',
          align: 'center',
          dataIndex: 'caseAmount',
          customRender: function(t, r, index) {
            if (r.circuitResult !== 10000) {
              return '-'
            } else {
              return t
            }
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'circuitResult_dictText',
          customRender: function(t, r, index) {
            if (r.circuitResult === 20000) {
              return '进行中'
            } else {
              return t
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
        list: `mission/codeManagement/list`
      },
      distributorList: [],
      sellData: [],
      user: null,
      hospitalList: [],
      sellValue: undefined,
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    preview(record) {
      this.$refs.codeControlModal.show(record)
    },
    downloadCode(record) {
      const token = Vue.ls.get(ACCESS_TOKEN)
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = `${Vue.prototype.API_BASE_URL}/mission/fileInfo/download?id=${record.fileInfoId}&token=${token}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    resetQuery() {
      this.queryParam = {}
      this.sellValue = null;
      this.loadData()
    },
    onChange(e) {
      if (e.target.value === '') {
        this.loadData()
      }
    },
    handleShowViewportUploadModal() {
      this.$refs.viewportUploadModal.show()
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
      this.$set(this.queryParam, 'agencyId', undefined) // clean the previous data if the sellUser or sellUserId changed
      if (value) {
        // this.showSendAccess = true
        this.queryParam.seller = value
        this.loadDistributorList(value)
      }
    },
    loadDistributorList(value) {
      const that = this
      getDistributorList({
        sellUser: value
      }).then(res => {
        if (res.success) {
          that.distributorList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
  },
  mounted() {
    this.user = this.$store.state.user.info;
    this.loadDistributorList();
    if (this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics')) {
      this.sellData = [this.user]
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function(val, oldVal) {
        console.log(this.$route.query.leaveApplyId)
        if (this.$route.query.leaveApplyId) {
          console.log(this.$route.query.leaveApplyId)
          this.queryParam.leaveApplyId = this.$route.query.leaveApplyId
          this.searchQuery()
          history.pushState({}, '', '/codeControl')
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.search-group {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  margin-left: 0 !important;

  .group {
    display: flex;
    justify-items: center;
    align-items: center;
    margin-right: 15px;

    .title {
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
      text-align: right;
      flex: 0 0 88px;
    }
  }

  .ant-btn {
    margin-right: 15px;
  }
}
.btn-group {
  display: flex;
  justify-content: space-evenly;
}
</style>
