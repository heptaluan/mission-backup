<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fullName">
              <a-input v-model="model.fullName" placeholder="请输入姓名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sex">
              <j-dict-select-tag type="list" v-model="model.sex" dictCode="sex" placeholder="请选择性别" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="birthday">
              <j-date placeholder="请选择生日" v-model="model.birthday"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="mobile">
              <a-input v-model="model.mobile" placeholder="请输入联系电话"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="紧急联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="emergencyMobile">
              <a-input v-model="model.emergencyMobile" placeholder="请输入紧急联系电话"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="工作单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="workCompany">
              <a-input v-model="model.workCompany" placeholder="请输入工作单位"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="部门/科室" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="workDep">
              <a-input v-model="model.workDep" placeholder="请输入部门/科室"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="职位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jobTitle">
              <a-input v-model="model.jobTitle" placeholder="请输入职位"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="照片" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="picUrl">
              <a-input v-model="model.picUrl" placeholder="请输入照片"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="联系人类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contactType">
              <j-dict-select-tag type="list" v-model="model.contactType" dictCode="contact_type" placeholder="请选择联系人类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="关联单位/项目组" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="relationUnit">
              <j-dict-select-tag type="list" v-model="model.relationUnit" dictCode="" placeholder="请选择关联单位/项目组" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'ContactManageForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
        },
        url: {
          add: "/mission/contactManage/add",
          edit: "/mission/contactManage/edit",
          queryById: "/mission/contactManage/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>