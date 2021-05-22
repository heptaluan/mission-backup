<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    cancelText="关闭"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      style="max-width: 1080px; margin: 40px auto 0;"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="form"
      :rules="rules"
    >

      <a-form-model-item label="出库仓库" prop="warehouse">
        <a-select v-model="form.type" placeholder="请选择出库仓库">
          <a-select-option value="shanghai">
            出库仓库一
          </a-select-option>
          <a-select-option value="beijing">
            出库仓库二
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="出库类型" prop="type">
        <a-select v-model="form.type" placeholder="请选择出库类型">
          <a-select-option value="shanghai">
            出库类型一
          </a-select-option>
          <a-select-option value="beijing">
            出库类型二
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="出库对象" prop="target">
        <a-select v-model="form.type" placeholder="请选择出库对象">
          <a-select-option value="shanghai">
            出库对象一
          </a-select-option>
          <a-select-option value="beijing">
            出库对象二
          </a-select-option>
        </a-select>
      </a-form-model-item>

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

export default {
  name: 'StockOutModal',
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      title: '',
      width: 1280,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      form: {
        warehouse: undefined,
        type: undefined,
        target: undefined
      },
      rules: {
        warehouse: [{ required: true, message: '请选择出库仓库', trigger: 'blur' }],
        type: [{ required: true, message: '请选择出库类型', trigger: 'change' }],
        target: [{ required: true, message: '请选择出库对象', trigger: 'change' }]
      },
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
          title: '耗材序号',
          align: 'center',
          dataIndex: 'materialCode'
        },
        {
          title: '耗材名称',
          align: 'center',
          dataIndex: 'materialName'
        },
        {
          title: '耗材数量',
          align: 'center',
          dataIndex: 'materialTotal'
        }
      ],
      url: {
        list: '/mission/materialManagement/list',
        delete: '/mission/materialManagement/delete',
        deleteBatch: '/mission/materialManagement/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportXls',
        importExcelUrl: 'mission/materialManagement/importExcel'
      }
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    handleCancel() {
      console.log(`取消`)
      this.visible = false
    },
    handleOk() {
      console.log(`确定`)
      this.visible = false
    }
  }
}
</script>
