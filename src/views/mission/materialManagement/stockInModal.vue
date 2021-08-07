<template>
  <div>
    <j-modal :title="title" :width="width" :visible="visible" switchFullscreen :okButtonProps="{ class: { 'jee-hidden': dis } }" cancelText="关闭" @ok="handleOk" @cancel="handleCancel">
      <div class="form-state">
        <a-tag v-if="state === 2" color="#108ee9">待审核</a-tag>
        <a-tag v-if="state === 3" color="#87d068">已审核通过</a-tag>
        <a-tag v-if="state === 4" color="#f50">已退回</a-tag>
      </div>
      <a-form-model style="max-width: 1080px; margin: 20px auto 0" ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol" :model="form" :rules="rules">
        <a-form-model-item ref="code" label="批次号" prop="code">
          <a-input
            :disabled="dis"
            placeholder="请输入批次号"
            v-model="form.code"
            @blur="
              () => {
                $refs.code.onFieldBlur()
              }
            "
          />
        </a-form-model-item>

        <a-form-model-item label="入库仓库" prop="type">
          <j-dict-select-tag :disabled="dis" type="list" v-model="form.type" dictCode="warehouse_manage, name, id" placeholder="请选择入库仓库" />
        </a-form-model-item>
        <div class="tool-bar" style="text-align: right">
          <a-button class="add-btn" @click="handleAddMaterial" type="primary" icon="plus" v-if="!dis">新增</a-button>
          <a-button class="add-btn" @click="handleCommitMaterial" type="primary" v-if="dis">提交审核</a-button>
          <a-button class="add-btn" @click="handleRetractMaterial" type="primary" v-if="dis">撤回</a-button>
        </div>

        <!-- table区域-begin -->
        <a-table
          ref="table"
          size="middle"
          :scroll="{ x: true }"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          class="j-table-force-nowrap"
          @change="handleTableChange"
        >
          <template slot="amount" slot-scope="text, record">
            <editable-cell :disabled="dis" :text="text" @change="onCellChange(record.id, 'amount', $event)" />
          </template>
        </a-table>
      </a-form-model>
    </j-modal>

    <MaterialFilterModal ref="materialFilterModal" @ok="submitCallback" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import MaterialFilterModal from './MaterialFilterModal'
import EditableCell from './editCell'
import { stockComeApply, queryByIdStockIn, approve } from 'src/api/mission/project'

export default {
  name: 'StockInModal',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    MaterialFilterModal,
    EditableCell,
  },
  data() {
    return {
      title: '入库单',
      width: 1280,
      visible: false,
      disableSubmit: false,
      dis: false,
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      form: {
        code: '',
        type: undefined,
      },
      rules: {
        code: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
        type: [{ required: true, message: '请选择入库仓库', trigger: 'change' }],
      },
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '耗材序号',
          align: 'center',
          dataIndex: 'materialCode',
        },
        {
          title: '耗材名称',
          align: 'center',
          dataIndex: 'materialName',
        },
        {
          title: '耗材数量',
          align: 'center',
          dataIndex: 'amount',
          scopedSlots: { customRender: 'amount' },
        },
      ],
      url: {
        list: '',
      },
      list: [],
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
    submitCallback(selectRow) {
      this.dataSource = []
      if (!Array.isArray(selectRow)) return false
      selectRow.forEach(row => {
        row.amount = '0'
        this.dataSource.push(row)
      })
      console.log(this.dataSource)
    },
    handleCancel() {
      console.log(`取消`)
      this.visible = false
    },
    handleOk() {
      this.submitSave()
    },
    submitSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const postData = {
            batchNo: this.form.code,
            comeStocks: [],
            warehouseId: this.form.type,
          }
          this.dataSource.forEach(row => {
            if (parseInt(row.amount) > 0) {
              postData.comeStocks.push({
                amount: parseInt(row.amount),
                materialId: row.id,
              })
            }
          })
          stockComeApply(postData)
            .then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.visible = false
              }
            })
            .finally(() => {
              // that.confirmLoading = false
            })
        }
      })
    },
    handleAddMaterial() {
      this.$refs.materialFilterModal.show()
    },
    handleCommitMaterial() {
      const that = this
      const query = {
        applyId: this.pId,
        applyType: 1,
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
        applyType: 1,
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
    handleSelectionRows(val) {
      this.list = val
    },
    onCellChange(id, dataIndex, value) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.id === id)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
    loadData(id) {
      if (id) {
        const that = this
        const query = {
          applyId: id,
          applyType: 1,
        }
        queryByIdStockIn(query).then(res => {
          if (res.success) {
            that.dataSource = res.result.applyDetail.records
            that.form.code = res.result.batchNo
            that.form.type = res.result.warehouseId
            that.state = res.result.status
          } else {
            that.$message.warning(res.message)
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.add-btn {
  margin-bottom: 20px;
  margin-right: 15px;
}
.form-state {
  position: absolute;
  top: 70px;
  right: 35px;
}
</style>
