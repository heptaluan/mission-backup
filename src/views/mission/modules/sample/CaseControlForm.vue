<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="form" :rules="rules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="填写的批次" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="person">
              <a-select v-model="form.type" placeholder="请选择进行填写的批次">
                <a-select-option value="1">
                  批次一
                </a-select-option>
                <a-select-option value="2">
                  批次二
                </a-select-option>
                <a-select-option value="3">
                  批次三
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'

export default {
  name: 'CaseControlForm',
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
        xs: { span: 25 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      form: {
        code: '',
        person: undefined
      },
      rules: {
        code: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
        person: [{ required: true, message: '请选择项目研究所处阶段', trigger: 'change' }]
      },
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
<style lang="less" scoped>
.btn-group {
  margin-bottom: 30px;
  padding-left: 20px;

  button {
    margin-right: 20px;
  }
}
</style>
