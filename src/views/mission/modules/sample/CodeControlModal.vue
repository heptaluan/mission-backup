<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model ref="form" :label-col="labelCol" :wrapper-col="wrapperCol">
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
      </a-table>
    </a-form-model>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import { getCodeManagementList } from 'src/api/mission/project'

export default {
  name: 'CodeControlModal',
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      title: '查看编号',
      width: 1280,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      record: {},
      visible: false,
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
          title: '机构',
          align: 'center',
          dataIndex: 'agencyId_dictText'
        },
        {
          title: '病例编号',
          align: 'center',
          dataIndex: 'codeMedicalCase'
        },
        {
          title: '样本编号',
          align: 'center',
          dataIndex: 'codeNumber'
        },
        {
          title: '癌症类别',
          align: 'center',
          dataIndex: 'cancerType_dictText'
        },
        {
          title: '研究类别',
          align: 'center',
          dataIndex: 'researchType_dictText'
        },
        {
          title: '样本类别',
          align: 'center',
          dataIndex: 'sampleType_dictText'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
      ],
      url: {
        list: '/mission/materialManagement/list'
      }
    }
  },
  methods: {
    show(record) {
      this.record = record
      this.visible = true
      this.loadData()
      console.log(record)
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.$emit('ok')
      this.visible = false
    },
    loadData() {
      const that = this
      getCodeManagementList({
        codeManageId: that.record.id
      }).then(res => {
        if (res.success) {
          that.dataSource = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
  },
}
</script>
