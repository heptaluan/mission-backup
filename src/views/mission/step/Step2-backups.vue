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
      <a-form-model-item label="绑定组长单位/leader cooperation" prop="cooperation">
        <a-select v-model="form.cooperation" placeholder="请选择组长单位" @change="handleChange">
          <a-select-option v-for="item in cooperationList" :key="item.id" :value="item.id">
            {{ item.caName }}
          </a-select-option>
        </a-select>
        <a-button class="add-btn" type="primary" @click="addCooperation">
          新增合作单位
        </a-button>
      </a-form-model-item>
      <a-form-model-item label="添加分中心/leader cooperation" prop="cooperation">
        <a-select mode="tags" placeholder="请选择合作单位作为分中心">
          <a-select-option v-for="item in subCenterList" :key="item.id" :value="item.id" @change="handleAddSubCenter">
            {{ item.caName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <div>
        <a-table
          ref="table"
          size="middle"
          :scroll="{x:true}"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          class="j-table-force-nowrap"
          @change="handleTableChange">

          <span slot="action" slot-scope="text, record">
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
         </span>
        </a-table>
      </div>

      <a-form-item :wrapperCol="{ span: 13, offset: 7 }">
        <div class="btn-group">
          <a-button @click="save">保存</a-button>
          <a-button type="primary" class="prev-btn" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </div>
      </a-form-item>
    </a-form-model>
    <cooperation-agency-modal ref="modalForm" @ok="modalFormOk"></cooperation-agency-modal>
  </div>
</template>

<script>
  import CooperationAgencyModal from 'src/views/mission/modules/CooperationAgencyModal'
  import { queryCooperationAgency, addProjectCooperation, queryProjectCooperationAgency } from 'src/api/mission/project'
  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'Step2',
  components: {
    CooperationAgencyModal
  },
  mixins:[JeecgListMixin, mixinDevice],
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      form: {
        cooperation: undefined
      },
      cooperationList: [],
      subCenterList: [],
      hasMianCenter: false,
      projectCooperation: [],
      projectId: undefined,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key:'rowIndex',
          width:60,
          align:"center",
          customRender:function (t,r,index) {
            return parseInt(index)+1;
          }
        },
        {
          title:'合作单位',
          align:"center",
          dataIndex: 'companyId'
        },
        {
          title:'合作类型',
          align:"center",
          dataIndex: 'corporationType',
          customRender: function (text) {
            return !text ? '' : (text === 1 ? '组长单位' : '分中心')
          }
        },
        {
          title:'合作开始时间',
          align:"center",
          dataIndex: 'createTime',
          customRender:function (text) {
            return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/mission/cooperationAgency/project',
        delete: "/mission/cooperationAgency/delete",
      },
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
    loadData () {
      const that = this
      queryCooperationAgency().then(res => {
        if (res.success) {
          that.cooperationList = res.result.records
          that.subCenterList = res.result.records.slice().filter((o) => {
            return o.id !== that.form.cooperation
          })
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    getProjectCooperation () {
      const that = this
      const id = this.projectId
      queryProjectCooperationAgency({
        projectId: id,
        page: 1,
        size: 20
      }).then(res => {
        if (res.success) {
          that.dataSource = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    addCooperation () {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    handleChange (val) {
      this.handleAddProjectCooperation(true, val)
    },
    filterCenterList (val) {
      this.subCenterList = this.cooperationList.slice().filter((o) => {
        return o.id !== val
      })
    },
    modalFormOk () {
      this.loadData()
    },
    handleAddSubCenter (val) {
      this.handleAddProjectCooperation(false, val)
    },
    handleAddProjectCooperation (isMain, companyId) {
      const that = this
      const postData = {
        agencyId: companyId,
        corporationType: isMain ? 1 : 2,
        projectId: this.projectId
      }
      addProjectCooperation(postData).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('ok')
          that.getProjectCooperation()
          if (isMain) this.filterCenterList(companyId)
        } else {
          that.$message.warning(res.message)
        }
      }).finally(() => {
        that.confirmLoading = false
      })
    }
  },
  mounted () {
    this.loadData()
    this.projectId = this.getParams('id') || '1397099928368467970'
    window.history.replaceState({}, window.document.title, '?id=' + this.projectId + '&step=2')
    this.getProjectCooperation()
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
    right: -125px;
    top: -8px;
  }
}
</style>
