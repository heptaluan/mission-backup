<template>
  <a-card :bordered="false">
    <div class="search-group">
      <div class="group">
        <div class="title">批次号</div>
        <a-input allowClear v-model="batchNo" placeholder="请输入批次号"></a-input>
      </div>
      <div class="group">
        <div class="title">质控责任人</div>
        <j-dict-select-tag allowClear style="width: 200px" type="list" dictCode="contact_manage, full_name, id" placeholder="请选择质控责任人" v-model="informContactId" />
      </div>

      <a-button @click="handleSearch" type="primary">筛选</a-button>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">发起样本入库</a-button>
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
          <span v-if="!text" style="font-size: 12px; font-style: italic">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width: 80px; font-size: 12px; font-style: italic" />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)"> 下载 </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <div class="btn-group">
            <a @click="showDetail(record)">质控</a>
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
import { getStockApplyList, getUserList } from 'src/api/mission/project'

export default {
  name: 'Sample',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    SampleManagementModal,
  },
  data() {
    return {
      description: '样本管理页面',
      batchNo: '',
      informContactId: undefined,
      dataList: [],
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
          title: '批次号',
          align: 'center',
          dataIndex: 'batchNo',
        },
        {
          title: '责任人',
          align: 'center',
          dataIndex: 'sampleType',
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'totalRecordAmount',
        },
        {
          title: '合格数',
          align: 'center',
          dataIndex: 'sex',
        },
        {
          title: '不合格数',
          align: 'center',
          dataIndex: 'age',
        },
        {
          title: '入库人',
          align: 'center',
          dataIndex: 'createBy',
        },
        {
          title: '入库时间',
          align: 'center',
          dataIndex: 'createTime',
        },
        {
          title: '是否已短信通知',
          align: 'center',
          dataIndex: 'informApplyResult_dictText',
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
        list: 'mission/caseSample/stockApply/list',
      },
    }
  },
  methods: {
    loadData() {
      const that = this
      const query = {
        batchNo: this.batchNo,
        informContactId: this.informContactId,
      }
      getStockApplyList(query).then(res => {
        if (res.success) {
          that.dataList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    getUserList() {
      const that = this
      getUserList().then(res => {
        console.log(res)
        if (res.success) {
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleSearch() {
      this.loadData()
    },
    showDetail(record) {
      this.$router.push(`/mission/sample/sampleResult?id=${record.id}`)
    },
  },
  mounted() {
    this.getUserList()
  },
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
