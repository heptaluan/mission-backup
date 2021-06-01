<template>
  <a-card :bordered="false">
    <a-form-model
      style="max-width: 1080px; margin: 20px auto 0;"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="code" label="批次号" prop="code">
        <a-input
          placeholder="请输入批次号"
          v-model="form.code"
          @blur="
            () => {
              $refs.code.onFieldBlur()
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="total" label="总数" prop="total">
        <a-input
          placeholder="请输入总数"
          v-model="form.total"
          @blur="
            () => {
              $refs.total.onFieldBlur()
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="qualifiedNum" label="合格数" prop="qualifiedNum">
        <a-input
          placeholder="请输入合格数"
          v-model="form.qualifiedNum"
          @blur="
            () => {
              $refs.qualifiedNum.onFieldBlur()
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="unqualifiedNum" label="不合格数" prop="unqualifiedNum">
        <a-input
          placeholder="请输入不合格数"
          v-model="form.unqualifiedNum"
          @blur="
            () => {
              $refs.unqualifiedNum.onFieldBlur()
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item label="结果反馈对象" prop="feedback">
        <a-select v-model="form.feedback" placeholder="请选择结果反馈对象">
          <a-select-option value="shanghai">
            类型一
          </a-select-option>
          <a-select-option value="beijing">
            类型二
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="质控报告内容" :labelCol="{ span: 3 }" :wrapperCol="{ span: 20 }"> </a-form-model-item>

      <div class="edit-box">
        <Editor :content.sync="content" />
      </div>

      <div class="search-group">
        <a-select style="width: 230px" placeholder="请选择条目进行筛选">
          <a-select-option value="shanghai">
            已检测
          </a-select-option>
          <a-select-option value="beijing">
            未检测
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
          <a-radio-group v-model="record.value" @change="onRadioChange(record.id, 'amount', $event)">
            <a-radio :value="1">
              已检测
            </a-radio>
            <a-radio :value="2">
              未检测
            </a-radio>
          </a-radio-group>
        </template>

      </a-table>

      <div class="btn-group">
        <a-button type="primary" @click="handleSave">保存</a-button>
      </div>
    </a-form-model>
  </a-card>
</template>

<script>
import Editor from '../step/Editor'
import api from 'src/api/mission/sampleInfo'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

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
      form: {
        code: '5468',
        total: '100',
        qualifiedNum: '80',
        unqualifiedNum: '20',
        feedback: undefined
      },
      rules: {
        code: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
        total: [{ required: true, message: '请输入总数', trigger: 'blur' }],
        qualifiedNum: [{ required: true, message: '请输入合格数', trigger: 'blur' }],
        unqualifiedNum: [{ required: true, message: '请输入不合格数', trigger: 'blur' }],
        feedback: [{ required: true, message: '请选择结果反馈对象', trigger: 'change' }]
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
        list: '/mission/materialManagement/list',
        delete: api.delete,
        deleteBatch: api.deleteBatch,
        exportXlsUrl: api.exportXlsUrl,
        importExcelUrl: api.importExcelUrl
      }
    }
  },
  methods: {
    handleSearch() {},
    onRadioChange(id, dataIndex, value) {

    },
    handleSave() {}
  }
}
</script>

<style lang="less" scoped>
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
</style>
