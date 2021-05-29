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
      <a-form-model-item ref="chinaName" label="项目名称（中文）" prop="projectName">
        <a-input
          placeholder="请输入项目名称（中文）"
          v-model="form.projectName"
          @blur="
            () => {
              $refs.projectName.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item ref="projectEnName" label="项目名称/Project Name（English）" prop="projectEnName">
        <a-input
          placeholder="请输入项目名称（English）"
          v-model="form.projectEnName"
          @blur="
            () => {
              $refs.projectEnName.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item ref="code" label="项目编码/Project Code" prop="projectCode">
        <a-input
          placeholder="请输入项目编码"
          v-model="form.projectCode"
          @blur="
            () => {
              $refs.projectCode.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item label="项目类型/Project Type" prop="physicalProperty">
        <j-dict-select-tag type="list" v-model="form.physicalProperty" dictCode="project_type" placeholder="请选择项目类型" />
      </a-form-model-item>

      <a-form-model-item label="项目设计/Project Design" prop="projectDesign">
        <j-dict-select-tag type="list" v-model="form.projectDesign" dictCode="project_design" placeholder="请选择项目设计" />
      </a-form-model-item>
      <a-form-model-item label="项目研究所处阶段/Project Phase" prop="projectStage">
        <j-dict-select-tag type="list" v-model="form.projectStage" dictCode="study_phase" placeholder="请选择项目研究所处阶段" />
      </a-form-model-item>
      <a-form-model-item label="项目组/Project Group" prop="projectGroupId">
        <a-select v-model="form.projectGroupId" placeholder="请选择项目组">
          <a-select-option v-for="item in groupList" :key="item.id" :value="item.id">
            {{ item.groupName }}
          </a-select-option>
        </a-select>
        <a-button class="add-btn" type="primary" @click="addProjectGroup">
          新增
        </a-button>
      </a-form-model-item>
      <a-form-model-item label="项目内部负责人/Project Leader" prop="chargePeopleId">
        <a-select v-model="form.chargePeopleId" placeholder="请选择项目内部负责人">
          <a-select-option v-for="item in chargePeople" :key="item.id" :value="item.id">
            {{ item.fullName }}
          </a-select-option>
        </a-select>
        <a-button class="add-btn" type="primary" @click="addLeader">
          新增
        </a-button>
      </a-form-model-item>
      <a-form-model-item label="项目目的/Project Goal" prop="projectGoal">
        <a-input placeholder="请输入项目目的" :rows="4" allowClear v-model="form.projectGoal" type="textarea" />
      </a-form-model-item>

      <a-form-item :wrapperCol="{ span: 13, offset: 5 }">
        <div class="btn-group">
          <a-button class="save-btn" @click="save">保存</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </div>
      </a-form-item>
    </a-form-model>
    <project-group-modal ref="modalForm" @ok="modalFormOk"></project-group-modal>
    <contact-manage-modal ref="manageForm" @ok="manageFormOk"></contact-manage-modal>
  </div>
</template>

<script>
import api from 'src/api/mission/project'
import { httpAction, getAction } from '@/api/manage'
import ProjectGroupModal from 'src/views/mission/modules/ProjectGroupModal'
import ContactManageModal from 'src/views/mission/modules/ContactManageModal'
import { queryGroup, queryChargePeople } from 'src/api/mission/project'

export default {
  name: 'Step1',
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      form: {
        projectName: '',
        projectEnName: '',
        projectCode: '',
        physicalProperty: undefined,
        projectDesign: undefined,
        projectStage: undefined,
        projectGroupId: undefined,
        leader: undefined,
        projectGoal: ''
      },
      rules: {
        projectName: [{ required: true, message: '请输入项目名称（中文）', trigger: 'blur' }],
        projectEnName: [{ required: true, message: '请输入项目名称（English）', trigger: 'blur' }],
        projectCode: [{ required: true, message: '请输入项目编码', trigger: 'blur' }],
        physicalProperty: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
        projectDesign: [{ required: true, message: '请选择项目设计', trigger: 'change' }],
        projectStage: [{ required: true, message: '请选择项目研究所处阶段', trigger: 'change' }],
        projectGroupId: [{ required: true, message: '请选择项目组', trigger: 'change' }],
        leader: [{ required: true, message: '请选择项目内部负责人', trigger: 'change' }],
        projectGoal: [{ required: true, message: '请输入项目目的', trigger: 'blur' }]
      },
      isSave: false,
      url: {
        add: api.add,
        edit: api.put
      },
      groupList: [],
      chargePeople: []
    }
  },
  components: {
    ProjectGroupModal,
    ContactManageModal
  },
  methods: {
    nextStep() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit('nextStep')
        } else {
          return false
        }
      })
    },
    save() {
      const that = this
      // 触发表单验证
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.form.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          httpAction(httpurl, this.form, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.$emit('ok')
              const projectId = res.result.projectId
              window.history.replaceState({}, window.document.title, '?id=' + projectId)
              this.isSave = true
            } else {
              that.$message.warning(res.message)
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }
      })
    },
    addProjectGroup () {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    addLeader () {
      this.$refs.manageForm.add()
      this.$refs.manageForm.title = '新增'
      this.$refs.manageForm.disableSubmit = false
    },
    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadGroupData()
    },
    manageFormOk () {
      this.loadChargePeople()
    },
    loadGroupData () {
      const that = this
      queryGroup().then(res => {
        if (res.success) {
          that.groupList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    loadChargePeople() {
      const that = this
      queryChargePeople().then(res => {
        if (res.success) {
          that.chargePeople = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  },
  mounted () {
    //备份model原始值
    this.loadGroupData()
    this.loadChargePeople()
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
