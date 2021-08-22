<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class: { 'jee-hidden': dis } }"
    cancelText="关闭"
    @ok="handleOk"
    :footer ='footer'
    @cancel="handleCancel"
  >
    <div class="form-state">
      <a-tag v-if="state === 2" color="#108ee9">待审核</a-tag>
      <a-tag v-if="state === 3" color="#87d068">已审核通过</a-tag>
      <a-tag v-if="state === 4" color="#f50">已退回</a-tag>
    </div>
    <a-form-model
      style="max-width: 1080px; margin: 20px auto 0;"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="form"
      :rules="rules"
    >
      <a-form-model-item label="出库仓库" prop="warehouseId">
        <j-dict-select-tag
          :disabled="dis"
          type="list"
          v-model="form.warehouseId"
          dictCode="warehouse_manage, name, id"
          placeholder="请选择出库仓库"
          change="onChange"
        />
      </a-form-model-item>

      <a-form-model-item label="项目" prop="project">
        <j-dict-select-tag
          :disabled="dis"
          type="list"
          v-model="form.project"
          dictCode="project_info, project_name, id, logical_state=1"
          placeholder="请选择项目"
        />
      </a-form-model-item>

      <a-form-model-item label="合作单位" prop="leaveTarget">
        <a-select :disabled="dis" v-model="form.leaveTarget" placeholder="请选择合作单位">
          <a-select-option v-for="item in cooperationList" :key="item.id" :value="item.id">
            {{ item.departName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="病例数" prop="caseLoad">
        <a-input-number :disabled="dis" placeholder="请输入病例数" allowClear v-model="form.caseLoad" />
      </a-form-model-item>
      <a-form-model-item label="出库单号" prop="id" v-if="form.id">
        <span v-html="form.id"></span>
      </a-form-model-item>

      <a-form-model-item label="备注" prop="remark">
        <a-input :disabled="dis" placeholder="请输入备注" :rows="4" allowClear v-model="form.remark" />
      </a-form-model-item>

      <div style="margin-top: 60px"></div>
      <div class="footer-bar tool-bar">
        <span v-if="form.status === 1" v-has="'stockOutAdd'">
          <a-button class="add-btn" @click="handleCommitMaterial" type="primary">提交审核</a-button>
          <a-button class="add-btn" @click="handleRetractMaterial" type="primary">撤回</a-button>
        </span>
        <span v-if="form.status === 2" v-has="'stockOutCheck'">
            <a-button class="add-btn" @click="handlePassMaterial" type="primary" >通过</a-button>
            <a-button class="add-btn" @click="handleRetractMaterial" type="primary">退回</a-button>
        </span>
        <span class="flex-1"></span>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk" :disabled="dis">保存</a-button>
<!--        <a-button key="submitAndCheck" type="primary" :loading="loading" @click="handleOkAndCommitCheck" :disabled="dis">保存并提交审核</a-button>-->
        <a-button key="back" @click="handleCancel">取消</a-button>
      </div>
    </a-form-model>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import { getCooperationUnitList, leaveApply, approve, queryByIdStockIn, getAuthForQc } from 'src/api/mission/project'

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
      footer: null,
      applyId: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
      cooperationList: [],
      form: {
        warehouseId: undefined,
        project: undefined,
        leaveTarget: undefined,
        caseLoad: '',
        status: undefined,
        remark: ''
      },
      rules: {
        warehouseId: [{ required: true, message: '请选择出库仓库', trigger: 'blur' }],
        type: [{ required: true, message: '请选择出库类型', trigger: 'change' }],
        leaveTarget: [{ required: true, message: '请选择合作单位', trigger: 'change' }],
        desc: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      // 表头
      columns: [],
      url: {
        list: '/mission/materialManagement/list',
        delete: '/mission/materialManagement/delete',
        deleteBatch: '/mission/materialManagement/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportXls',
        importExcelUrl: 'mission/materialManagement/importExcel'
      },
      pId: undefined,
      state: null,
      isLeading: undefined
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
        this.form = {}
      }
      this.visible = true
    },
    handleCancel() {
      console.log(`取消`)
      this.visible = false
    },
    handleOkAndCommitCheck () {
      this.handleOk()
    },
    handleOk() {
      const that = this
      const postData = {
        caseAmount: this.form.caseLoad,
        leaveTarget: this.form.leaveTarget,
        projectId: this.form.project,
        remark: this.form.remark,
        targetType: 1,
        warehouseId: this.form.warehouseId
      }
      leaveApply(postData)
        .then(res => {
          if (res.success) {
            that.$message.success(res.message)
            that.$emit('ok')
            that.visible = false
          } else {
            that.$message.warning(res.message)
          }
        })
        .finally(() => {
          that.confirmLoading = false
        })
    },
    loadCooperatorData() {
      const that = this
      getCooperationUnitList().then(res => {
        if (res.success) {
          that.cooperationList = res.result
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    loadData(id) {
      if (id) {
        const that = this
        const query = {
          applyId: id,
          applyType: 2
        }
        queryByIdStockIn(query).then(res => {
          if (res.success) {
            that.form.id = res.result.id
            that.form.warehouseId = res.result.warehouseId
            that.form.project = res.result.projectId
            that.form.leaveTarget = res.result.leaveTarget
            that.form.caseLoad = res.result.caseAmount
            that.form.remark = res.result.remark
            that.form.status = res.result.status
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
        status: 2
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
    handlePassMaterial () {
      const that = this
      const query = {
        applyId: this.pId,
        applyType: 2,
        status: 3
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
        status: 1
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
    getAuth() {
      // getAuthForQc().then(res => {
      //   if (res.success) {
      //     this.isLeading = res.result
      //   }
      // })
    }
  },
  mounted() {
    // this.getAuth()
    this.loadCooperatorData()
  }
}
</script>
<style lang="less" scoped>
.form-state {
  position: absolute;
  top: 70px;
  right: 35px;
}

.add-btn {
  margin-right: 15px;
}
.footer-bar {
  margin-top: 10px;
  padding: 10px 30px;
  text-align: right;
  background: transparent;
  border-top: 1px solid #e8e8e8;
  border-radius: 0 0 4px 4px;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center
}
.footer-bar .ant-btn {
  margin-right: 15px;
}
.footer-bar .flex-1 {
  flex: 1;
}
</style>
