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
      <a-form-model-item label="组长单位/leader cooperation" prop="cooperation">
        <a-select v-model="form.cooperation" placeholder="请选择组长单位">
          <a-select-option value="shanghai">
            类型一
          </a-select-option>
          <a-select-option value="beijing">
            类型二
          </a-select-option>
        </a-select>
        <a-button class="add-btn" type="primary">
          新增
        </a-button>
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
  name: 'Step2',
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      form: {
        cooperation: undefined
      },
      rules: {
        cooperation: [{ required: true, message: '请选择组长单位', trigger: 'change' }]
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
