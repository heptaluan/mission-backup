<template>
  <div>
    <a-form-model
      style="max-width: 1080px; margin: 40px auto 0;"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="chinaName" label="样本总量/Total Samples" prop="total">
        <a-input
          placeholder="请输入样本总量"
          v-model="form.chinaName"
          @blur="
            () => {
              $refs.chinaName.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item ref="englishName" label="周预计量/pcs of week" prop="pcs">
        <a-input
          placeholder="请输入周预计量"
          v-model="form.englishName"
          @blur="
            () => {
              $refs.englishName.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item ref="code" label="入组样本类型/type of samples" prop="type">
        <a-input
          placeholder="请输入入组样本类型"
          v-model="form.code"
          @blur="
            () => {
              $refs.code.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item label="说明/description" prop="desc">
        <a-input placeholder="请输入项目说明" :rows="4" allowClear v-model="form.desc" type="textarea" />
      </a-form-model-item>

      <a-form-item :wrapperCol="{ span: 13, offset: 5 }">
        <div class="btn-group">
          <a-button @click="save">保存</a-button>
          <a-button type="primary" class="prev-btn" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </div>
      </a-form-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'Step6',
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      form: {
        total: '',
        pcs: '',
        type: '',
        desc: ''
      },
      rules: {
        total: [{ required: true, message: '请输入样本总量', trigger: 'blur' }],
        pcs: [{ required: true, message: '请输入周预计量', trigger: 'blur' }],
        type: [{ required: true, message: '请输入入组样本类型', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入项目说明', trigger: 'blur' }]
      }
    }
  },
  methods: {
    prevStep() {
      this.$emit('prevStep')
    },
    nextStep() {
      this.$emit('nextStep')
      // this.$refs.ruleForm.validate(valid => {
      //   if (valid) {
      //     this.$emit('nextStep')
      //   } else {
      //     return false
      //   }
      // })
    },
    save() {
      console.log(`save`)
    }
  }
}
</script>

<style lang="less" scoped>
.btn-group {
  text-align: right;

  .prev-btn {
    margin: 0 15px;
  }
}

/deep/ .ant-form-item-children {
  position: relative;

  .add-btn {
    position: absolute;
    right: -85px;
    top: -8px;
  }
}
</style>
