<template>
  <a-card :bordered="false">
    <a-form-model
      style="max-width: 1080px; margin: 40px auto 0;"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
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

      <a-form-model-item ref="total" label="总数" prop="total">
        <a-input
          placeholder="请输入总数"
          v-model="form.total"
          @blur="
            () => {
              $refs.total.onFieldBlur()
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="qualifiedNum" label="合格数" prop="qualifiedNum">
        <a-input
          placeholder="请输入合格数"
          v-model="form.qualifiedNum"
          @blur="
            () => {
              $refs.qualifiedNum.onFieldBlur()
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="unqualifiedNum" label="不合格数" prop="unqualifiedNum">
        <a-input
          placeholder="请输入不合格数"
          v-model="form.unqualifiedNum"
          @blur="
            () => {
              $refs.unqualifiedNum.onFieldBlur()
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item label="结果反馈对象" prop="feedback">
        <a-select v-model="form.feedback" placeholder="请选择结果反馈对象">
          <a-select-option value="shanghai">
            类型一
          </a-select-option>
          <a-select-option value="beijing">
            类型二
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="质控报告内容" :labelCol="{ span: 3 }" :wrapperCol="{ span: 20 }"></a-form-model-item>
      <div class="edit-box">
        <Editor :content.sync="content" />
      </div>
    </a-form-model>
  </a-card>
</template>

<script>
import Editor from '../step/Editor'

export default {
  name: 'SampleResultWrite',
  components: {
    Editor
  },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 17 },
      content: '',
      form: {
        code: '5468',
        total: '100',
        qualifiedNum: '80',
        unqualifiedNum: '20',
        feedback: undefined
      },
      rules: {
        code: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
        total: [{ required: true, message: '请输入总数', trigger: 'blur' }],
        qualifiedNum: [{ required: true, message: '请输入合格数', trigger: 'blur' }],
        unqualifiedNum: [{ required: true, message: '请输入不合格数', trigger: 'blur' }],
        feedback: [{ required: true, message: '请选择结果反馈对象', trigger: 'change' }]
      }
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.edit-box {
  padding: 0 90px 20px 20px;
}
</style>
