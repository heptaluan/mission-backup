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
      <a-form-model-item ref="chinaName" label="项目名称（中文）" prop="chinaName">
        <a-input
          placeholder="请输入项目名称（中文）"
          v-model="form.chinaName"
          @blur="
            () => {
              $refs.chinaName.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item ref="englishName" label="项目名称/Project Name（English）" prop="englishName">
        <a-input
          placeholder="请输入项目名称（English）"
          v-model="form.englishName"
          @blur="
            () => {
              $refs.englishName.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item ref="code" label="项目编码/Project Code" prop="code">
        <a-input
          placeholder="请输入项目编码"
          v-model="form.code"
          @blur="
            () => {
              $refs.code.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item label="项目类型/Project Type" prop="type">
        <a-select v-model="form.type" placeholder="请选择项目类型">
          <a-select-option value="shanghai">
            类型一
          </a-select-option>
          <a-select-option value="beijing">
            类型二
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="项目设计/Project Design" prop="design">
        <a-select v-model="form.type" placeholder="请选择项目设计">
          <a-select-option value="shanghai">
            类型一
          </a-select-option>
          <a-select-option value="beijing">
            类型二
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="项目研究所处阶段/Project Phase" prop="phase">
        <a-select v-model="form.type" placeholder="请选择项目研究所处阶段">
          <a-select-option value="shanghai">
            类型一
          </a-select-option>
          <a-select-option value="beijing">
            类型二
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="项目组/Project Group" prop="group">
        <a-select v-model="form.type" placeholder="请选择项目组">
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
      <a-form-model-item label="项目内部负责人/Project Leader" prop="leader">
        <a-select v-model="form.type" placeholder="请选择项目类型">
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
      <a-form-model-item label="项目目的/Project Goal" prop="desc">
        <a-input placeholder="请输入项目目的" :rows="4" allowClear v-model="form.desc" type="textarea" />
      </a-form-model-item>

      <a-form-item :wrapperCol="{ span: 13, offset: 5 }">
        <div class="btn-group">
          <a-button class="save-btn" @click="save">保存</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </div>
      </a-form-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'Step1',
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      form: {
        chinaName: '',
        englishName: '',
        code: '',
        type: undefined,
        design: undefined,
        phase: undefined,
        group: undefined,
        leader: undefined,
        desc: ''
      },
      rules: {
        chinaName: [{ required: true, message: '请输入项目名称（中文）', trigger: 'blur' }],
        englishName: [{ required: true, message: '请输入项目名称（English）', trigger: 'blur' }],
        code: [{ required: true, message: '请输入项目编码', trigger: 'blur' }],
        type: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
        design: [{ required: true, message: '请选择项目设计', trigger: 'change' }],
        phase: [{ required: true, message: '请选择项目研究所处阶段', trigger: 'change' }],
        group: [{ required: true, message: '请选择项目组', trigger: 'change' }],
        leader: [{ required: true, message: '请选择项目内部负责人', trigger: 'change' }],
        desc: [{ required: true, message: '请输入项目目的', trigger: 'blur' }]
      }
    }
  },
  methods: {
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

  .save-btn {
    margin-right: 15px;
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
