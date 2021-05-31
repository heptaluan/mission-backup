<template>
  <a-card :bordered="false">
    <a-form-model
      style="margin-bottom: 40px;"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <div class="search-group">
        <div class="group">
          <div class="title">项目</div>
          <a-select style="width: 150px" placeholder="请选择项目">
            <a-select-option value="shanghai">
              项目一
            </a-select-option>
            <a-select-option value="beijing">
              项目二
            </a-select-option>
          </a-select>
        </div>
        <div class="group">
          <div class="title">样本编号</div>
          <a-input style="width: 150px" placeholder="请输入样本编号" />
        </div>
        <div class="group">
          <div class="title">批次号</div>
          <a-select style="width: 150px" placeholder="请选择批次号">
            <a-select-option value="shanghai">
              批次号一
            </a-select-option>
            <a-select-option value="beijing">
              批次号二
            </a-select-option>
          </a-select>
        </div>
        <div class="group">
          <div class="title">质控责任人</div>
          <a-select style="width: 150px" placeholder="请选择质控责任人">
            <a-select-option value="shanghai">
              责任人一
            </a-select-option>
            <a-select-option value="beijing">
              责任人二
            </a-select-option>
          </a-select>
        </div>

        <a-button @click="handleSearch" type="primary">搜索</a-button>
      </div>

      <!-- 项目资料 -->
      <div class="project-list">
        <h4 :style="{ marginBottom: '16px' }">
          项目资料
        </h4>
        <a-list bordered :data-source="projectList" style="max-width: 600px">
          <a-list-item slot="renderItem" slot-scope="item">
            {{ item }}
          </a-list-item>
        </a-list>
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
          <a @click="executeTest(record)">检测</a>
        </span>
      </a-table>
    </a-form-model>

    <SampleTestModal ref="sampleTestModal" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SampleTestModal from '../modules/sample/SampleTestModal'
import api from 'src/api/mission/sample'

export default {
  name: 'SampleTest',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    SampleTestModal
  },
  data() {
    return {
      title: '',
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
      projectList: [
        '项目一',
        '项目二',
        '项目三',
      ],
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
          dataIndex: 'index'
        },
        {
          title: '样本编号',
          align: 'center',
          dataIndex: 'code'
        },
        {
          title: '样本类型',
          align: 'center',
          dataIndex: 'sampleType'
        },
        {
          title: '检测责任人',
          align: 'center',
          dataIndex: 'responsible'
        },
        {
          title: '检测时间',
          align: 'center',
          dataIndex: 'time'
        },
        {
          title: '检测指导手册',
          align: 'center',
          dataIndex: 'manual'
        },
        {
          title: '检测报告时间',
          align: 'center',
          dataIndex: 'reportTime'
        },
        {
          title: '检测报告',
          align: 'center',
          dataIndex: 'state'
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
        // list: api.list,
        list: '/mission/materialManagement/list',
        delete: api.delete,
        deleteBatch: api.deleteBatch,
        exportXlsUrl: api.exportXlsUrl,
        importExcelUrl: api.importExcelUrl
      }
    }
  },
  methods: {
    handleSearch() {},
    executeTest() {
      this.$refs.sampleTestModal.show()
    }
  }
}
</script>
<style scoped lang="less">
@import '~@assets/less/common.less';

.project-list {
  margin: 20px 0;
}

.search-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .group {
    display: flex;
    align-items: center;

    .title {
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
    }
  }
}
</style>
