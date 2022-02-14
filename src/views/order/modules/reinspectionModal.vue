<template>
  <j-modal
    :title='title'
    :width='width'
    :visible='visible'
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    :cancelButtonProps="{ class: { 'hideBtn': reinspected } }"
    @ok='handleOk'
    @cancel='handleCancel'
  >
    <a-form-model ref='form' :model='model' :rules='validatorRules' v-if='!reinspected'>

      <a-form-model-item label='重检的??' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='nnn'>
        <a-radio-group v-model='model.nnn' read-only>
          <a-radio :value='1'>
            重检？？？
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label='重检的组学' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='inspection'>
        <a-checkbox-group v-model='model.inspection'>
          <a-checkbox :value='1'>表观组</a-checkbox>
          <a-checkbox :value='2'>代谢组</a-checkbox>
          <a-checkbox :value='3'>代谢组</a-checkbox>
        </a-checkbox-group>
      </a-form-model-item>
    </a-form-model>
    <a-result
      status='success'
      title='重检已结束'
      sub-title='请查看重检结果.'
      v-if='reinspected'
    >
      <!--        <template #extra>-->
      <!--          <a-button key="console" type="primary">-->
      <!--            Go Console-->
      <!--          </a-button>-->
      <!--          <a-button key="buy">-->
      <!--            Buy Again-->
      <!--          </a-button>-->
      <!--        </template>-->
    </a-result>
  </j-modal>
</template>

<script>
export default {
  name: 'reinspectionModal',
  data() {
    return {
      title: '重检项',
      width: 500,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      model: {},
      validatorRules: {
        inspection: [{ required: true, message: '请选择重检组学!' }],
        nnn: [{ required: true, message: '请选择？？!' }]
      },
      reinspected: false
    }
  },
  methods: {
    show(record) {
      this.visible = true
      console.log(record)
    },
    handleCancel() {
      this.visible = false
      this.reinspected = false
      this.model.inspection = null
      this.model.nnn = null
    },
    handleOk() {
      console.log(this.model.inspection, ' - ', this.model.nnn)
      if (!this.reinspected) {
        this.$refs.form.validate(valid => {
          if (valid) {
            // this.visible = false
            this.reinspected = true
            this.model.inspection = null
            this.model.nnn = null
          } else {
            return false
          }
        })
      } else {
        this.visible = false
        this.reinspected = false
      }
    }
  }
}
</script>

<style scoped lang='less'>
.label-title {
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  font-size: 16px;
  line-height: 1.5;
}

.checkBox {
  text-align: center;
}

/deep/ .hideBtn {
  display: none !important;
}
</style>