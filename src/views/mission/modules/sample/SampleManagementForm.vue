<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <a-form-model ref="form" :model="form" :rules="rules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="项目" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectId">
              <j-dict-select-tag type="list" v-model="form.projectId" dictCode="project_info, project_name, id" placeholder="请选择项目" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="批次号" :labelCol="labelCol" :wrapperCol="wrapperCol" ref="batchNo" prop="batchNo">
              <a-input
                v-model="form.batchNo"
                placeholder="请输入批次号"
                @blur="
                  () => {
                    $refs.batchNo.onFieldBlur()
                  }
                "
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="质控责任人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="qcContactId">
              <j-dict-select-tag type="list" v-model="form.qcContactId" dictCode="contact_manage, full_name, id" placeholder="请选择质控责任人" />
            </a-form-model-item>
          </a-col>
          <div class="btn-group">
            <a-button type="primary" icon="download">下载模板</a-button>
          </div>
          <a-col :span="24">
            <a-upload-dragger @change="handleChange" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
              <a-button class="upload-btn" type="primary" icon="import">导入excel</a-button>

              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">也可以拖动文件到该区域进行上传</p>
            </a-upload-dragger>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import { caseSampleUploadFile } from 'src/api/mission/project'

export default {
  name: 'SampleManagementForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      model: {},
      labelCol: {
        xs: { span: 25 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      form: {
        projectId: undefined,
        batchNo: '',
        qcContactId: undefined,
      },
      rules: {
        projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
        batchNo: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
        qcContactId: [{ required: true, message: '质控责任人', trigger: 'change' }],
      },
      url: {
        add: '/mission/materialManagement/add',
        edit: '/mission/materialManagement/edit',
        queryById: '/mission/materialManagement/queryById',
      },
      fileList: [],
      file: undefined,
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add() {},
    handleChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.fileList = fileList
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      this.file = file
      return false
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!that.fileList[0]) {
            that.$message.error('上传文件不能为空')
            return false
          }
          const formData = new FormData()
          formData.append('file', that.file)
          const apply = {
            projectId: that.form.projectId,
            qcContactId: that.form.qcContactId,
            batchNo: that.form.batchNo,
          }
          formData.append('apply', JSON.stringify(apply))
          caseSampleUploadFile(formData)
            .then(res => {
              if (res.success) {
                that.fileList = []
                that.$message.success('文件上传成功！')
                that.$emit('ok')
              } else {
                that.$message.error(res.message)
              }
            })
            .catch(e => {
              that.$message.error('上传失败，请重新尝试！')
            })
        }
      })
    },
  },
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

.upload-btn {
  position: absolute;
  top: -63px;
  left: 150px;
}
</style>
