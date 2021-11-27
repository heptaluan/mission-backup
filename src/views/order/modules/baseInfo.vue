<template>
  <div>
    <a-form-model :layout="layout" ref="ruleForm" :model="form" :rules="validatorRules" style="margin: 20px auto 0;">
      <h3 class="order-title">基本信息</h3>
      <div class="order-content" style="padding-left: 15px;">
        <a-form-model-item label="身份证号" prop="identityNumber" class="order-label">
          <a-input
            :disabled="disabledState"
            placeholder="请输入身份证号"
            v-model="form.identityNumber"
            @change="handleIdChange"
          />
        </a-form-model-item>
        <a-form-model-item label="姓名" prop="caseName" class="order-label">
          <a-input :disabled="disabledState" placeholder="请输入姓名" v-model="form.caseName" />
        </a-form-model-item>

        <a-form-model-item label="性别" prop="gender" class="order-label">
          <a-radio-group :disabled="disabledState" v-model="form.gender" @change="handleSexChange">
            <a-radio :value="1">
              男
            </a-radio>
            <a-radio :value="0">
              女
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </div>

      <div class="order-content" style="padding-left: 15px;">
        <a-form-model-item label="年龄" prop="age" class="order-label">
          <a-input :disabled="disabledState" placeholder="请输入年龄" v-model="form.age" />
        </a-form-model-item>
        <a-form-model-item label="联系电话" prop="phoneNumber" class="order-label">
          <a-input :disabled="disabledState" placeholder="请输入联系电话" v-model="form.phoneNumber" />
        </a-form-model-item>
      </div>

      <div class="order-content" style="padding-left: 15px;">
        <a-form-model-item label="住院号" class="order-label">
          <a-input placeholder="请输入住院号" v-model="form.liveHospitalNumber" />
        </a-form-model-item>
        <a-form-model-item label="病理号" class="order-label">
          <a-input placeholder="请输入病理号" v-model="form.pathologyNumber" />
        </a-form-model-item>
        <a-form-model-item label="影像号" class="order-label">
          <a-input placeholder="请输入影像号" v-model="form.medicalImageNumber" />
        </a-form-model-item>
      </div>

      <h3 class="order-title">销售信息</h3>
      <div class="order-content withStar">
        <span class="star">* </span>
        <a-form-model-item label="关联泰莱销售" class="order-label">
          <a-select
            style="width:200px;"
            show-search
            :value="sellValue"
            placeholder="输入关联销售进行检索"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @search="handleSellSearch"
            @change="handleSellChange"
          >
            <a-select-option v-for="item in sellData" :key="item.id" :value="item.username">
              {{ item.realname }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="渠道商" prop="sendAccess" v-show="showSendAccess || sellValue" class="order-label">
          <a-select style="width:200px;" v-model="form.sendAccess" placeholder="请选择渠道商">
            <a-select-option v-for="item in distributorList" :key="item.id" :value="item.id">
              {{ item.accessName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </div>

      <h3 class="order-title">送检单位信息</h3>
      <div class="order-content" style="padding-left: 15px;">
        <a-form-model-item label="送检医院" prop="sendHospital" class="order-label">
          <a-input placeholder="请输入送检医院" v-model="form.sendHospital" />
        </a-form-model-item>
        <a-form-model-item label="送检科室" prop="sendDepartment" class="order-label">
          <a-input placeholder="请输入送检科室" v-model="form.sendDepartment" />
        </a-form-model-item>
        <a-form-model-item label="送检医生" class="order-label">
          <a-input placeholder="请输入送检医生" v-model="form.sendDoctor" />
        </a-form-model-item>
      </div>

      <div class="btn-group">
        <a-button type="primary" @click="save" style="margin-right:15px;">保存</a-button>
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import { getOrderStepInfo, lookUpMedicalCase, createOrderApplyInfo } from 'src/api/order/index'
import { queryRoleUsers } from '../../../api/material/index'
import { getDistributorList } from '../../../api/product/index'

function sellFetch(value, callback) {
  let timeout
  let currentValue

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  function fake() {
    queryRoleUsers({
      role: 'sales_omics',
      name: value
    }).then(res => {
      if (res.success) {
        if (currentValue === value) {
          const result = res.result
          const data = []
          result.forEach(r => {
            data.push({
              key: r.id,
              realname: r.realname,
              username: r.username,
              id: r.id
            })
          })
          callback(data)
        }
      } else {
        console.log(res.message)
      }
    })
  }

  timeout = setTimeout(fake, 300)
}

export default {
  name: 'base-info',
  data() {
    return {
      layout: 'inline',
      orderId: null,
      form: {},
      validatorRules: {
        caseName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        age: [{ required: true, message: '请输入正确的年龄', trigger: 'blur', pattern: /^((1[0-1])|[1-9])?\d$/ }],
        identityNumber: [
          {
            required: true,
            pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        phoneNumber: [
          {
            required: true,
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        liveHospitalNumber: [{ required: true, message: '请输入住院号', trigger: 'blur' }],
        pathologyNumber: [{ required: true, message: '请输入病理号', trigger: 'blur' }],
        medicalImageNumber: [{ required: true, message: '请输入影像号', trigger: 'blur' }],
        seller: [{ required: true, message: '请选择关联泰莱销售', trigger: 'blur' }],
        sendAccess: [{ required: true, message: '请选择渠道商', trigger: 'blur' }],
        sendHospital: [{ required: true, message: '请输入送检医院', trigger: 'blur' }],
        sendDepartment: [{ required: true, message: '请输入送检科室', trigger: 'blur' }],
        sendDoctor: [{ required: true, message: '请输入送检医生', trigger: 'blur' }]
      },
      distributorList: [],
      idData: [],
      idValue: undefined,
      sellData: [],
      sellValue: undefined,
      showSendAccess: false,
      disabledState: false,
      medicalCaseId: '',
      user: null
    }
  },
  props: {
    order: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  mounted() {
    this.user = this.$store.state.user.info
    this.initForm()
  },
  methods: {
    initForm() {
      const that = this
      if (this.getParams('orderId')) {
        const params = {
          orderId: this.getParams('orderId'),
          step: 0
        }
        getOrderStepInfo(params).then(res => {
          if (res.code === 200) {
            that.form = res.result
            that.sellValue = res.result.seller_dictText
            that.loadDistributorList(res.result.seller)
            that.disabledState = true
          } else {
            that.disabledState = false
          }
        })
      }
      // set value of role to the selector of '关联泰莱销售' if role includes sales_omics but not sales_super_omics
      if (this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics')) {
        this.sellData = [this.user]
      }
    },
    nextStep() {
      // this.$emit('nextStep')
      const cb = () => {
        this.$emit('nextStep', 0)
      }
      this.save(cb)
    },
    save(cb) {
      const that = this
      this.$refs.ruleForm.validate(valid => {
        if (!that.form.seller) {
          that.$message.warning(`请选择关联泰莱销售`)
          return
        }

        if (valid) {
          const orderId = that.getParams('orderId')
          that.form.orderId = orderId ? orderId : null
          that.medicalCaseId = that.medicalCaseId ? that.medicalCaseId : null

          createOrderApplyInfo(that.form).then(res => {
            if (res.code === 200) {
              that.form.gender = Number(that.form.gender)
              that.orderId = res.result.id
              that.medicalCaseId = res.result.medicalCaseId
              that.$message.success('基本信息已保存！')
              history.pushState({}, '', `${this.$route.path}?orderId=${res.result.id}`)
              if (typeof cb === 'function') cb()
            } else {
              that.form.gender = Number(that.form.gender)
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    handleSexChange(val) {},
    handleSellSearch(value) {
      if (!(this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics'))) {
        sellFetch(value, data => (this.sellData = data))
      }
    },
    handleSellChange(value) {
      this.sellValue = value
      if (!(this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics'))) {
        sellFetch(value, data => (this.sellData = data))
      }
      if (this.user.role.includes('sales_super_omics')) {
        this.$set(this.form, 'sendAccess', ''); // clean the previous data if the sellUser or sellUserId changed
      }
      if (value) {
        this.showSendAccess = true
        this.form.seller = value
        this.loadDistributorList(value)
      }
    },
    handleIdChange(e) {
      const that = this
      const re = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      if (re.test(e.target.value)) {
        lookUpMedicalCase({
          identityNumber: e.target.value
        }).then(res => {
          if (res.success) {
            if (res.result) {
              that.form = res.result
              that.form.medicalCaseId = res.result.id
              that.form.id = null
            } else {
              that.form.medicalCaseId = null
            }
          } else {
            that.$message.warning(res.message)
          }
        })
      }
    },
    loadDistributorList(value) {
      const that = this
      getDistributorList({
        sellUser: value
      }).then(res => {
        if (res.success) {
          that.distributorList = res.result.records
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
    }
  }
}
</script>

<style lang="less" scoped>
.order-title {
  margin-bottom: 30px;
}

.order-content {
  margin-bottom: 25px;
  &.withStar {
    display: flex;
    .star {
      align-self: center !important;
      color: #f5222d;
      font-size: 14px;
      margin-right: 5px;
      font-family: SimSun, sans-serif;
    }
  }
  .ant-input {
    width: 200px;
  }

  .ant-form-item:last-child {
    margin-right: 0;
  }

  .ant-upload-picture-card-wrapper {
    display: flex;
  }

  .ant-form-item-with-help {
    margin-bottom: 0;
  }
}

.btn-group {
  margin-top: 40px;
  text-align: right;
}
</style>
<style lang="less">
.order-label {
  .ant-form-item-label {
    min-width: 95px;
  }
}
</style>
