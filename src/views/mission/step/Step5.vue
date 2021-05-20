<template>
  <div>
    <a-form-model
      style="max-width: 1080px; margin: 40px auto 0;"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <div class="edit-wrap">
        <div class="title">项目纳入标准/Project inclusion criteria</div>
        <div class="edit-box">
          <Editor :content.sync="inclusionContent" />
        </div>
      </div>

      <div class="edit-wrap">
        <div class="title">项目排除标准/Project Exclusion criteria</div>
        <div class="edit-box">
          <Editor :content.sync="exclusionContent" />
        </div>
      </div>
      <div class="btn-group">
        <a-button @click="save">保存</a-button>
        <a-button type="primary" class="prev-btn" @click="prevStep">上一步</a-button>
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import Editor from './Editor'

export default {
  name: 'Step5',
  components: {
    Editor
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      inclusionContent: '',
      exclusionContent: ''
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
      console.log(this.inclusionContent)
      console.log(this.exclusionContent)
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

.edit-wrap {
  margin-bottom: 40px;

  .title {
    font-size: 16px;
    color: #424242;
    margin-bottom: 20px;
  }
}
</style>
