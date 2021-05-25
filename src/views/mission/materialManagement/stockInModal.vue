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
      <a-form-model-item ref="code" label="批次号" prop="code">
        <a-input
          placeholder="请输入批次号"
          v-model="form.code"
          @blur="
            () => {
              $refs.code.onFieldBlur()
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item label="入库仓库" prop="type">
        <a-select v-model="form.type" placeholder="请选择入库仓库">
          <a-select-option value="shanghai">
            入库仓库一
          </a-select-option>
          <a-select-option value="beijing">
            入库仓库二
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
  name: 'StockInModal',
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
        code: '',
        type: undefined
      },
      rules: {
        code: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
        type: [{ required: true, message: '请选择入库仓库', trigger: 'change' }]
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
    close() {},
    submitCallback() {
      this.$emit('ok')
      this.visible = false
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
