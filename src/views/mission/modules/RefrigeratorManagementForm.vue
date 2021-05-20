<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="冰箱名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfName">
              <a-input v-model="model.rfName" placeholder="请输入冰箱名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="冰箱编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfCode">
              <a-input v-model="model.rfCode" placeholder="请输入冰箱编号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="冰箱层数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfFloors">
              <a-input-number v-model="model.rfFloors" placeholder="请输入冰箱层数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="冰箱型号ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfModelId">
              <a-input v-model="model.rfModelId" placeholder="请输入冰箱型号ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="冰箱每层容量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfCapacity">
              <a-input-number v-model="model.rfCapacity" placeholder="请输入冰箱每层容量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="购买日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfPurchaseDate">
              <j-date placeholder="请选择购买日期" v-model="model.rfPurchaseDate"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="预计使用年限" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rfDesignLife">
              <a-input-number v-model="model.rfDesignLife" placeholder="请输入预计使用年限" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入备注"  ></a-input>
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
    name: 'RefrigeratorManagementForm',
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
          add: "/mission/refrigeratorManagement/add",
          edit: "/mission/refrigeratorManagement/edit",
          queryById: "/mission/refrigeratorManagement/queryById"
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