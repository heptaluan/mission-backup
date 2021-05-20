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
      <a-form-model-item label="文件类型" prop="type">
        <a-select v-model="form.type" placeholder="请选择文件类型">
          <a-select-option value="shanghai">
            项目方案一
          </a-select-option>
          <a-select-option value="beijing">
            项目方案二
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-upload-dragger name="file" :multiple="true" action="xx" @change="handleChange">
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">
          单击或拖动文件到该区域进行上传
        </p>
      </a-upload-dragger>

      <!-- table区域-begin -->
      <div class="table-wrap">
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
          <!-- 编辑区域 -->
          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">编辑</a>

            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="handleDetail(record)">详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </a-table>
      </div>

      <a-form-item :wrapperCol="{ span: 24 }">
        <div class="btn-group">
          <a-button @click="save">保存</a-button>
          <a-button type="primary" class="prev-btn" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </div>
      </a-form-item>
    </a-form-model>

    <MaterialDataManagementModal ref="modalForm" @ok="modalFormOk" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import MaterialDataManagementModal from '../modules/project/MaterialDataManagementModal'

export default {
  name: 'Step4',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    MaterialDataManagementModal
  },
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      form: {
        type: undefined
      },
      rules: {
        type: [{ required: true, message: '请选择文件类型', trigger: 'change' }]
      },
      // 表头
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
          title: '文件名称',
          align: 'center',
          dataIndex: 'fileName'
        },
        {
          title: '文件类型',
          align: 'center',
          dataIndex: 'fileType'
        },
        {
          title: '上传时间',
          align: 'center',
          dataIndex: 'uploadTime'
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
        list: '/mission/materialManagement/list',
        delete: '/mission/materialManagement/delete',
        deleteBatch: '/mission/materialManagement/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportXls',
        importExcelUrl: 'mission/materialManagement/importExcel'
      }
    }
  },
  methods: {
    // 上传
    handleChange(info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
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
    }
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

.table-wrap {
  margin-top: 40px;
}
</style>
