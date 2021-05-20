<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="序号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialCode">
                <a-input v-model="model.materialCode" placeholder="请输入序号"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialName">
                <a-input v-model="model.materialName" placeholder="请输入名称"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="样本类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialType">
                <a-input v-model="model.materialName" placeholder="请输入样本类型"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                label="样本规格"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                prop="materialStandards"
              >
                <a-input v-model="model.materialName" placeholder="请输入样本规格"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="自定义前缀" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialPrefix">
                <a-input v-model="model.materialName" placeholder="请输入自定义前缀"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="份数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialCopies">
                <a-input v-model="model.materialName" placeholder="请输入份数"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialDesc">
                <a-input v-model="model.materialName" placeholder="请输入说明"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'

export default {
  name: 'SuppliesPlanEachForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      validatorRules: {},
      url: {
        add: '/mission/materialManagement/add',
        edit: '/mission/materialManagement/edit',
        queryById: '/mission/materialManagement/queryById'
      }
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add() {
      this.edit(this.modelDefault)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          httpAction(httpurl, this.model, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>
