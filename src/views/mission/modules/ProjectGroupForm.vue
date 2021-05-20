<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="项目组名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="groupName">
              <a-input v-model="model.groupName" placeholder="请输入项目组名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="groupDescribe">
              <a-input v-model="model.groupDescribe" placeholder="请输入说明"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目组内部负责人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="groupChargeId">
              <j-dict-select-tag type="list" v-model="model.groupChargeId" dictCode="contact_manage,full_name,id" placeholder="请选择项目组内部负责人" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目组材料" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ownershipType">
              <a-select v-model="model.ownershipType">
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <a-divider style="margin: 4px 0;" />
                  <div
                    style="padding: 4px 8px; cursor: pointer;"
                    @mousedown="e => e.preventDefault()"
                    @click="addData"
                  >
                    <a-icon type="plus" /> 新增
                  </div>
                </div>
                <a-select-option v-for="item in ownershipTypes" :key="item.id" :value="item.id">
                  {{ item.fileName }}
                </a-select-option>
              </a-select>
<!--              <j-dict-select-tag type="list" v-model="model.ownershipType" dictCode="file_info,file_name,id, ownership_type = '2'" placeholder="请选择项目资料" />-->
            </a-form-model-item>
<!--            <a-button @click="addData" class="bt-add-data">新增</a-button>-->
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
    <file-info-modal ref="modalForm" @ok="modalFormOk" :fileType ='fileType'></file-info-modal>
  </a-spin>
</template>

<script>
  import FileInfoModal from './FileInfoModal'
  import { httpAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import { queryOwnershipType } from 'src/api/mission/project'

  export default {
    name: 'ProjectGroupForm',
    components: {
      FileInfoModal,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      }
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
          add: "/mission/projectGroup/add",
          edit: "/mission/projectGroup/edit",
          queryById: "/mission/projectGroup/queryById"
        },
        ownershipTypes: [],
        fileType: '2'
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
      this.getOwnershipType()
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
      addData () {
        this.$refs.modalForm.add()
        this.$refs.modalForm.title = '新增'
        this.$refs.modalForm.disableSubmit = false
      },
      getOwnershipType () {
        const that = this
        let params = {
          ownershipType: '2'
        }
        queryOwnershipType(params).then(res => {
          if (res.success) {
            that.ownershipTypes = res.result.records
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      modalFormOk (ruslt) {
        console.log(ruslt)
        this.getOwnershipType()
        // this.model.ownershipType = result.id
      }
    }
  }
</script>
<style>
  .bt-add-data {
    position: absolute;
    top: 5px;
    right: 15px
  }
</style>