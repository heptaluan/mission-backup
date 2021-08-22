<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <div class="group">
            <div class="title">创建时间：</div>
            <j-date v-model="queryParam.createTime_begin" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss" style="width:120px" placeholder="请选择开始时间" ></j-date>
            <span style="width: 10px;">~</span>
            <j-date v-model="queryParam.createTime_end" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss" style="width:120px" placeholder="请选择结束时间"></j-date>
          </div>
          <div class="group">
            <div class="title">项目：</div>
            <j-dict-select-tag v-model="queryParam.projectId" dictCode="project_info, project_name, id, logical_state=1" placeholder="请选择项目组" style="width: 180px"></j-dict-select-tag>
          </div>
          <a-button @click="searchQuery" type="primary">查询</a-button>
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
        <div class="btn-group">
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
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import CodeControlModal from './modules/sample/CodeControlModal'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

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
          title: '出库单编号',
          align: 'center',
          dataIndex: 'leaveApplyId'
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'projectId_dictText'
        },
        {
          title: '机构名称',
          align: 'center',
          dataIndex: 'agencyId_dictText'
        },
        {
          title: '编号数量',
          align: 'center',
          dataIndex: 'codeAmount'
        },
        {
          title: '病例数量',
          align: 'center',
          dataIndex: 'caseAmount'
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
        list: 'mission/codeManagement/list'
      }
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
    }
  }
}
</script>
<style scoped lang="less">
  @import '~@assets/less/common.less';
  .search-group {
    display: flex;
    justify-content: flex-start;
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
      }
    }
  }
  .btn-group {
    display: flex;
    justify-content: space-evenly;
  }
</style>
