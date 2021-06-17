<template>
  <a-card :bordered="false">
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
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      class="j-table-force-nowrap"
      @change="handleTableChange"
    >
      <template slot="htmlSlot" slot-scope="text">
        <div v-html="text"></div>
      </template>
      <template slot="imgSlot" slot-scope="text">
        <span v-if="!text" style="font-size: 12px; font-style: italic"
          >无图片</span
        >
        <img
          v-else
          :src="getImgView(text)"
          height="25px"
          alt=""
          style="max-width: 80px; font-size: 12px; font-style: italic"
        />
      </template>
      <template slot="fileSlot" slot-scope="text">
        <span v-if="!text" style="font-size: 12px; font-style: italic"
          >无文件</span
        >
        <a-button
          v-else
          :ghost="true"
          type="primary"
          icon="download"
          size="small"
          @click="downloadFile(text)"
        >
          下载
        </a-button>
      </template>

      <span slot="action" slot-scope="text, record">
        <div class="btn-group">
          <a @click="preview(record)">查看</a>
          <a @click="downloadCode(record)">下载编号</a>
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
    CodeControlModal,
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
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '出库单编号',
          align: 'center',
          dataIndex: 'leaveApplyId',
        },
        {
          title: '出库时间',
          align: 'center',
          dataIndex: 'time',
        },
        {
          title: '对象',
          align: 'center',
          dataIndex: 'target',
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'caseAmount',
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
        list: 'mission/codeManagement/list',
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
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
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
.btn-group {
  display: flex;
  justify-content: space-evenly;
}
</style>
