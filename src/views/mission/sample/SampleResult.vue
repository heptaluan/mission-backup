<template>
  <a-card :bordered="false">
    <a-form-model
      style="max-width: 1080px; margin: 20px auto 0;"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-descriptions title="样本质控结果">
        <a-descriptions-item label="批次号">
          {{ result.batchNo }}
        </a-descriptions-item>
        <a-descriptions-item label="总数">
          {{ result.totalRecordAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="合格数">
          {{ result.qcPassAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="不合格数">
          {{ result.qcRejectAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="结果反馈对象">
          <j-dict-select-tag
            v-model="informContactId"
            style="width:200px;"
            type="list"
            dictCode="contact_manage, full_name, id"
            placeholder="请选择质控责任人"
          />
        </a-descriptions-item>
      </a-descriptions>

      <div class="edit-title">质控报告内容</div>

      <div class="edit-box">
        <Editor :content.sync="content" />

        <div class="btn-group">
          <a-button type="primary" @click="handleSave('save')">保存</a-button>
        </div>
      </div>

      <div class="search-group">
        <a-select v-model="circuitResult" style="width: 230px" placeholder="请选择条目进行筛选">
          <a-select-option value="10000">
            合格
          </a-select-option>
          <a-select-option value="20000">
            不合格
          </a-select-option>
        </a-select>
        <a-button @click="handleSearch" type="primary">筛选</a-button>
      </div>

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
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img
            v-else
            :src="getImgView(text)"
            height="25px"
            alt=""
            style="max-width:80px;font-size: 12px;font-style: italic;"
          />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <template slot="radio" slot-scope="text, record">
          <a-radio-group v-model="record.circuitResult" @change="onRadioChange(record, $event)">
            <a-radio :value="10000">
              合格
            </a-radio>
            <a-radio :value="20000">
              不合格
            </a-radio>
          </a-radio-group>
        </template>
      </a-table>

      <div class="btn-group">
        <a-button type="primary" @click="handleSave('end')">质控完成</a-button>
      </div>
    </a-form-model>
  </a-card>
</template>

<script>
import Editor from '../step/Editor'
import api from 'src/api/mission/sampleInfo'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getStockApplyQc, caseSampleQc, putStockApplyQc, getCaseSampleList } from 'src/api/mission/project'

export default {
  name: 'SampleResult',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    Editor
  },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 17 },
      content: '',
      id: '',
      informContactId: '',
      circuitResult: '10000',
      result: {
        batchNo: '',
        totalRecordAmount: '',
        qcPassAmount: '',
        qcRejectAmount: '',
        applyId: ''
      },
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '批次号',
          align: 'center',
          dataIndex: 'code'
        },
        {
          title: '样本编号',
          align: 'center',
          dataIndex: 'sampleCode'
        },
        {
          title: '样本类型',
          align: 'center',
          dataIndex: 'type'
        },
        {
          title: '质控责任人',
          align: 'center',
          dataIndex: 'person'
        },
        {
          title: '质控时间',
          align: 'center',
          dataIndex: 'time'
        },
        {
          title: '质控指导手册',
          align: 'center',
          dataIndex: 'manual'
        },
        {
          title: '质控报告时间',
          align: 'center',
          dataIndex: 'time1'
        },
        {
          title: '是否合格',
          align: 'center',
          dataIndex: 'state'
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'radio',
          scopedSlots: { customRender: 'radio' }
        }
      ],
      url: {
        list: '/mission/caseSample/list',
        delete: api.delete,
        deleteBatch: api.deleteBatch,
        exportXlsUrl: api.exportXlsUrl,
        importExcelUrl: api.importExcelUrl
      }
    }
  },
  methods: {
    handleSearch() {
      const that = this
      const query = {
        circuitResult: that.circuitResult
      }
      getStockApplyQc(query).then(res => {
        if (res.success) {
          that.result = res.result
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    onRadioChange(record, e) {
      const that = this
      const query = {
        id: record.id,
        code: e.target.value
      }
      caseSampleQc(query).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadFormData()
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
    loadFormData() {
      const that = this
      const query = {
        id: this.getParams('id')
      }
      getStockApplyQc(query).then(res => {
        if (res.success) {
          that.result = res.result
          that.id = res.result.id
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleSave(type) {
      const that = this
      let query
      switch (type) {
        case 'save':
          query = {
            id: that.id,
            qcReportContent: that.content,
            informContactId: that.informContactId
          }
          break
        case 'end':
          query = {
            id: that.id,
            circuitResult: 20000
          }
          break
        default:
          break
      }
      putStockApplyQc(query).then(res => {
        console.log(res)
        if (res.success) {
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  },
  mounted() {
    this.loadFormData()
  }
}
</script>

<style lang="less" scoped>
.edit-title {
  color: rgba(0, 0, 0, 0.85);
  font-weight: normal;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.search-group {
  margin: 40px 0 20px;

  .ant-btn {
    margin-left: 20px;
  }
}

.btn-group {
  margin-top: 20px;
  text-align: right;
}

/deep/ .ant-select-dropdown {
  z-index: 10002;
}
</style>
