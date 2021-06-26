<template>
  <j-modal :title="title" :width="width" :visible="visible" switchFullscreen :okButtonProps="{ class: { 'jee-hidden': dis } }" cancelText="关闭" @ok="handleOk" @cancel="handleCancel">
    <div class="form-state">
      <a-tag v-if="state === 2" color="#108ee9">待审核</a-tag>
      <a-tag v-if="state === 3" color="#87d068">已审核通过</a-tag>
      <a-tag v-if="state === 4" color="#f50">已退回</a-tag>
    </div>
    <a-form-model style="max-width: 1080px; margin: 20px auto 0" ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol" :model="form" :rules="rules">
      <a-form-model-item label="出库仓库" prop="warehouse">
        <j-dict-select-tag :disabled="dis" type="list" v-model="form.warehouse" dictCode="warehouse_manage, name, id" placeholder="请选择出库仓库" change="onChange" />
      </a-form-model-item>

      <a-form-model-item label="项目" prop="project">
        <j-dict-select-tag :disabled="dis" type="list" v-model="form.project" dictCode="project_info, project_name, id" placeholder="请选择项目" @input="handleChange" />
      </a-form-model-item>

      <a-form-model-item label="合作单位" prop="cooperator">
        <a-select :disabled="dis" v-model="form.cooperator" placeholder="请选择合作单位">
          <a-select-option v-for="item in cooperationList" :key="item.id" :value="item.id">
            {{ item.caName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="病例数" prop="caseLoad">
        <a-input :disabled="dis" placeholder="请输入病例数" :rows="4" allowClear v-model="form.caseLoad" />
      </a-form-model-item>

      <a-form-model-item label="备注" prop="remark">
        <a-input :disabled="dis" placeholder="请输入备注" :rows="4" allowClear v-model="form.remark" />
      </a-form-model-item>

      <div class="tool-bar" style="text-align: right">
        <a-button class="add-btn" @click="handleCommitMaterial" type="primary" v-if="dis">提交审核</a-button>
        <a-button class="add-btn" @click="handleRetractMaterial" type="primary" v-if="dis">撤回</a-button>
      </div>
    </a-form-model>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import { queryProject, leaveApply, approve, queryByIdStockIn } from 'src/api/mission/project'

export default {
  name: 'StockOutModal',
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      title: '出库单',
      width: 800,
      visible: false,
      disableSubmit: false,
      dis: false,
      applyId: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
      cooperationList: [],
      form: {
        warehouse: undefined,
        project: undefined,
        cooperator: undefined,
        caseLoad: '',
        remark: '',
      },
      rules: {
        warehouse: [{ required: true, message: '请选择出库仓库', trigger: 'blur' }],
        type: [{ required: true, message: '请选择出库类型', trigger: 'change' }],
        target: [{ required: true, message: '请选择出库对象', trigger: 'change' }],
        desc: [{ required: true, message: '请输入备注', trigger: 'blur' }],
      },
      // 表头
      columns: [],
      url: {
        list: '/mission/materialManagement/list',
        delete: '/mission/materialManagement/delete',
        deleteBatch: '/mission/materialManagement/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportXls',
        importExcelUrl: 'mission/materialManagement/importExcel',
      },
      pId: undefined,
      state: null,
    }
  },
  methods: {
    show(record) {
      if (record && record.id) {
        this.pId = record.id
        this.loadData(record.id)
        this.dis = true
      } else {
        this.dis = false
      }
      this.visible = true
    },
    handleCancel() {
      console.log(`取消`)
      this.visible = false
    },
    handleOk() {
      const that = this
      const postData = {
        caseAmount: this.form.caseLoad,
        leaveTarget: this.form.cooperator,
        projectId: this.form.project,
        remark: this.form.remark,
        targetType: 1,
        warehouseId: this.form.warehouse,
      }
      leaveApply(postData)
        .then(res => {
          console.log(res)
          if (res.success) {
            that.$message.success(res.message)
            that.visible = false
          } else {
            that.$message.warning(res.message)
          }
        })
        .finally(() => {
          that.confirmLoading = false
        })
    },
    loadCooperatorData(projectId) {
      const that = this
      queryProject({
        projectId: projectId,
        page: 1,
        size: 20,
      }).then(res => {
        if (res.success) {
          that.cooperationList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleChange(val) {
      this.loadCooperatorData(val)
    },
    loadData(id) {
      if (id) {
        const that = this
        const query = {
          applyId: id,
          applyType: 2,
        }
        queryByIdStockIn(query).then(res => {
          if (res.success) {
            that.form.warehouse = res.result.batchNo
            that.form.project = res.result.projectId
            that.form.cooperator = res.result.leaveTarget
            that.form.caseLoad = res.result.caseAmount
            that.form.remark = res.result.remark
          } else {
            that.$message.warning(res.message)
          }
        })
      }
    },
    handleCommitMaterial() {
      const that = this
      const query = {
        applyId: this.pId,
        applyType: 2,
        status: 2,
      }
      approve(query).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('ok')
          that.visible = false
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleRetractMaterial() {
      const that = this
      const query = {
        applyId: this.pId,
        applyType: 2,
        status: 1,
      }
      approve(query).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('ok')
          that.visible = false
        } else {
          that.$message.warning(res.message)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.form-state {
  position: absolute;
  top: 70px;
  right: 35px;
}

.add-btn {
  margin-bottom: 20px;
  margin-right: 15px;
}
</style>
