<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
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

      <a-form-model-item ref="sampleCode" label="样本编号" prop="sampleCode">
        <a-input
          placeholder="请输入样本编号"
          v-model="form.sampleCode"
          @blur="
            () => {
              $refs.sampleCode.onFieldBlur()
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="person" label="检测负责人" prop="person">
        <a-input
          placeholder="请输入检测负责人"
          v-model="form.person"
          @blur="
            () => {
              $refs.person.onFieldBlur()
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="report" label="检测报告" prop="report">
        <a-input
          placeholder="检测报告"
          v-model="form.report"
          @blur="
            () => {
              $refs.report.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
    </a-form-model>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'

export default {
  name: 'StockOutTipsModal',
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      title: '样本检测',
      width: 800,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      form: {
        code: '',
        sampleCode: '',
        person: '',
        report: ''
      },
      rules: {
        code: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
        sampleCode: [{ required: true, message: '请输入样本编号', trigger: 'blur' }],
        person: [{ required: true, message: '请输入检测负责人', trigger: 'blur' }],
        report: [{ required: true, message: '请输入检测报告', trigger: 'blur' }]
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
      this.visible = false
    },
    handleOk() {
      this.visible = false
    }
  }
}
</script>
