<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="form" :rules="rules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="项目" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="project">
              <a-select v-model="form.project" placeholder="请选择项目">
                <a-select-option value="shanghai">
                  项目一
                </a-select-option>
                <a-select-option value="beijing">
                  项目二
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="批次号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
              <a-input v-model="model.code" placeholder="请输入批次号"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="质控责任人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="person">
              <a-select v-model="form.person" placeholder="请选择质控责任人">
                <a-select-option value="shanghai">
                  责任人一
                </a-select-option>
                <a-select-option value="beijing">
                  责任人二
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <div class="btn-group">
            <a-button type="primary" icon="download">下载模板</a-button>
            <a-button type="primary" icon="import">导入excel</a-button>
          </div>
          <a-col :span="24">
            <a-upload-dragger name="file" :showUploadList="false" :customRequest="upload" :beforeUpload="beforeUpload">
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">
                也可以拖动文件到该区域进行上传
              </p>
            </a-upload-dragger>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import { uploadFile } from 'src/api/mission/project'

export default {
  name: 'SampleManagementForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      model: {},
      labelCol: {
        xs: { span: 25 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      form: {
        project: undefined,
        code: '',
        person: undefined
      },
      rules: {
        code: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
        person: [{ required: true, message: '请选择项目研究所处阶段', trigger: 'change' }]
      },
      url: {
        add: '/mission/materialManagement/add',
        edit: '/mission/materialManagement/edit',
        queryById: '/mission/materialManagement/queryById'
      },
      fileList: undefined
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add() {
      this.edit(this.modelDefault)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          httpAction(httpurl, this.model, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    downloadTemplate() {},
    beforeUpload(file) {
      this.fileList = file
      return true
    },
    upload() {
      const { fileList } = this
      console.log(fileList.name)
      const formData = new FormData()
      formData.append('file', fileList)

      const info = {
        ownershipType: '2',
        ownerId: this.projectId,
        fileName: fileList.name
      }
      formData.append('info', JSON.stringify(info))
      uploadFile(formData)
        .then(res => {
          if (res.success) {
            this.fileList = []
            this.$message.success('文件上传成功！')
            this.loadFileList()
          }
        })
        .catch(e => {
          this.uploading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.btn-group {
  margin-bottom: 30px;
  padding-left: 20px;

  button {
    margin-right: 20px;
  }
}
</style>
