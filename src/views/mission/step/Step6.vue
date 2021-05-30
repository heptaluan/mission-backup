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
      <a-form-model-item ref="noTotal" label="样本总量/Total Samples" prop="noTotal">
        <a-input
          placeholder="请输入样本总量"
          v-model="form.noTotal"
          @blur="
            () => {
              $refs.noTotal.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item ref="noWeek" label="周预计量/pcs of week" prop="noWeek">
        <a-input
          placeholder="请输入周预计量"
          v-model="form.noWeek"
          @blur="
            () => {
              $refs.noWeek.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item label="说明/description" prop="remark">
        <a-input placeholder="请输入项目说明" :rows="4" allowClear v-model="form.remark" type="textarea" />
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
import { getProjectSample, addProjectSample } from 'src/api/mission/project'

export default {
  name: 'Step6',
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      form: {
        noTotal: '',
        noWeek: '',
        remark: ''
      },
      rules: {
        noTotal: [{ required: true, message: '请输入样本总量', trigger: 'blur' }],
        noWeek: [{ required: true, message: '请输入周预计量', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入项目说明', trigger: 'blur' }]
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
    loadData() {
      const that = this
      getProjectSample({
        id: this.projectId
      }).then(res => {
        if (res.success) {
          if (res.result[0]) {
            this.id = res.result[0].id
            this.form.noTotal = res.result[0].noTotal ? res.result[0].noTotal : ''
            this.form.noWeek = res.result[0].noWeek ? res.result[0].noWeek : ''
            this.form.remark = res.result[0].remark ? res.result[0].remark : ''
          }
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    getParams(key) {
      const search = window.location.search.substring(1)
      const vars = search.split('&')
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=')
        if (pair[0] === key) {
          return pair[1]
        }
      }
      return false
    },
    save() {
      const that = this
      let postData
      if (this.id) {
        postData = {
          id: this.id,
          projectId: this.projectId,
          noTotal: Number(this.form.noTotal),
          noWeek: Number(this.form.noWeek),
          remark: this.form.remark
        }
      } else {
        postData = {
          projectId: this.projectId,
          noTotal: Number(this.form.noTotal),
          noWeek: Number(this.form.noWeek),
          remark: this.form.remark
        }
      }
      addProjectSample(postData)
        .then(res => {
          console.log(res)
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
  },
  mounted() {
    this.projectId = this.getParams('id')
    this.loadData()
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
