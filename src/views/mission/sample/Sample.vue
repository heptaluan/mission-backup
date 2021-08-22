<template>
  <a-card :bordered="false">
    <div class="search-group">
      <div class="group">
        <div class="title">批次号</div>
        <a-input allowClear v-model="batchNo" placeholder="请输入批次号"></a-input>
      </div>
      <div class="group">
        <div class="title">所处阶段</div>
        <j-dict-select-tag
          allowClear
          style="width:150px;"
          type="list"
          dictCode="case_sample_apply_circuit"
          placeholder="请选择所处阶段"
          v-model="currentCircuit"
        />
      </div>
      <div class="group">
        <div class="title">质控责任人</div>
        <a-select
          allowClear
          style="width:200px;"
          v-model="qcContactId"
          placeholder="请选择质控责任人"
          @change="handleSelectChange"
        >
          <a-select-option v-for="item in userList" :key="item.id" :value="item.id">
            {{ item.realname }}
          </a-select-option>
        </a-select>
      </div>

      <a-button @click="handleSearch" type="primary">筛选</a-button>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleStockIn" type="primary" icon="plus" v-has="'sampleIn'">发起样本入库</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataList"
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
          <div class="btn-group">
            <a v-if="record.unQualifyAmount === 0 && record.currentCircuit !== 1 && isRcLeader" @click="showDetail(record)">质控</a>
            <a v-if="record.unQualifyAmount !== 0 && record.currentCircuit !== 1 && isTestLeader" @click="handleChecked(record)">检查</a>
          </div>
        </span>
      </a-table>
    </div>

    <SampleManagementModal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SampleManagementModal from '../modules/sample/SampleManagementModal'
import { getStockApplyList, getUserList, getAuthForQc, getAuthForTest } from 'src/api/mission/project'

export default {
  name: 'Sample',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    SampleManagementModal
  },
  data() {
    return {
      description: '样本管理页面',
      batchNo: '',
      qcContactId: undefined,
      dataList: [],
      userList: [],
      currentCircuit: undefined,
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
          dataIndex: 'batchNo'
        },
        {
          title: '项目名',
          align: 'center',
          dataIndex: 'projectId_dictText'
        },
        {
          title: '责任人',
          align: 'center',
          dataIndex: 'qcContactId_dictText'
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'totalRecordAmount'
        },
        {
          title: '不合格数',
          align: 'center',
          dataIndex: 'unQualifyAmount'
        },
        {
          title: '入库人',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '入库时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '阶段状态',
          align: 'center',
          dataIndex: 'currentCircuit_dictText'
        },
        {
          title: '短信通知状态',
          align: 'center',
          dataIndex: 'esSendStatus_dictText'
        },
        {
          title: '短信通知次数',
          align: 'center',
          dataIndex: 'esSendNum'
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
        list: 'unload'
      },
      isTestLeader: false,
      isRcLeader: false
    }
  },
  methods: {
    loadData() {
      const that = this
      const query = {
        batchNo: this.batchNo,
        qcContactId: this.qcContactId,
        currentCircuit: this.currentCircuit
      }
      getStockApplyList(query).then(res => {
        if (res.success) {
          that.dataList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleStockIn() {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '样本入库'
      this.$refs.modalForm.disableSubmit = false
    },
    handleSearch() {
      this.loadData()
    },
    showDetail(record) {
      this.$router.push(`/mission/sample/sampleResult?id=${record.id}`)
    },
    handleChecked(record) {
      this.$router.push(`/mission/sample/sampleChecked?id=${record.id}`)
    },
    handleSelectChange(value) {
      this.qcContactId = value
    },
    getUserList() {
      const that = this
      getUserList().then(res => {
        if (res.success) {
          that.userList = res.result
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    getAuth() {
      getAuthForQc().then(res => {
        if (res.success) {
          this.isRcLeader = res.result
        }
      })
      getAuthForTest().then(res => {
        if (res.success) {
          this.isTestLeader = res.result
        }
      })
    }
  },
  mounted() {
    this.getAuth()
    this.getUserList()
  }
}
</script>
<style scoped lang="less">
@import '~@assets/less/common.less';

.search-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .group {
    display: flex;
    align-items: center;

    .title {
      min-width: 45px;
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
    }
  }
}

.btn-group {
  display: flex;
  justify-content: space-evenly;
}
</style>
