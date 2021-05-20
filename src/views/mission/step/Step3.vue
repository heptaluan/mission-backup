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
      <a-form-model-item label="开始时间/start time" prop="startTime">
        <a-date-picker
          class="time-select"
          v-model="form.startTime"
          :disabled-date="disabledStartDate"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="开始时间"
          @openChange="handleStartOpenChange"
          valueFormat
        />
      </a-form-model-item>
      <a-form-model-item label="结束时间/expect end date" prop="endTime">
        <a-date-picker
          class="time-select"
          v-model="form.endTime"
          :disabled-date="disabledEndDate"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="结束时间"
          :open="endOpen"
          @openChange="handleEndOpenChange"
          valueFormat
        />
      </a-form-model-item>
      <a-form-model-item label="周期">
        <a-input class="time-total" placeholder="项目周期" readOnly :value="time" />
      </a-form-model-item>

      <a-form-item :wrapperCol="{ span: 12, offset: 5 }">
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
  name: 'Step3',
  data() {
    return {
      labelCol: { span: 9 },
      wrapperCol: { span: 11 },
      time: '',
      form: {
        startTime: '',
        endTime: ''
      },
      rules: {
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
      },
      endOpen: false
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
    },
    disabledStartDate(startValue) {
      const endValue = this.form.endTime
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.form.startTime
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
      if (this.form.endTime) {
        const time = this.form.endTime.diff(this.form.startTime, 'day')
        this.time = (time === 0 ? 1 : time) + '天'
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
      if (this.form.startTime) {
        const time = this.form.endTime.diff(this.form.startTime, 'day')
        this.time = (time === 0 ? 1 : time) + '天'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.time-select,
.time-total {
  width: 280px;
}

.btn-group {
  text-align: right;

  .prev-btn {
    margin: 0 15px;
  }
}
</style>
