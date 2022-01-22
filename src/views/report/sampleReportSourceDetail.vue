<template>
  <a-card :bordered="false" class="report-detail">
    <div class="edit-toolbar">
      <a-button @click="setResult" class="margin-right-sm" v-if="report.reportType !==5" v-has="'report:modify'">选中为结果</a-button>
      <a-dropdown-button>
        报告结果版本
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1"> <a-icon type="appstore" /> 点内报告结果 </a-menu-item>
          <a-menu-item key="2"> <a-icon type="appstore" /> 医院报告结果 </a-menu-item>
          <a-menu-item key="3"> <a-icon type="appstore" /> 内部报告结果 </a-menu-item>
        </a-menu>
      </a-dropdown-button>
    </div>
    <a-descriptions title="用户信息">
      <a-descriptions-item label="用户姓名">{{patientInfo.name}}</a-descriptions-item>
      <a-descriptions-item label="年龄">{{patientInfo.age}}</a-descriptions-item>
      <a-descriptions-item label="样本编号">{{patientInfo.orderCode}}</a-descriptions-item>
      <a-descriptions-item label="性别">{{patientInfo.sex}}</a-descriptions-item>
      <a-descriptions-item label="住 院 号">{{patientInfo.patientId}}</a-descriptions-item>
      <a-descriptions-item label="送检医师">{{patientInfo.sendDoctor}}</a-descriptions-item>
      <a-descriptions-item label="临床诊断">{{patientInfo.clinical}}</a-descriptions-item>
      <a-descriptions-item label="送检单位">{{patientInfo.sendHospital_dictText}}</a-descriptions-item>
      <a-descriptions-item label="送检日期">{{patientInfo.createTime}}</a-descriptions-item>
      <a-descriptions-item label="检测方法">血液蛋白组学/代谢组学，以及医学影像等多组学技术</a-descriptions-item>
    </a-descriptions>
    <a-divider style="margin-bottom: 32px"/>
    <a-descriptions title="订单信息">
      <a-descriptions-item label="订单号">{{report.orderId}}</a-descriptions-item>
      <a-descriptions-item label="病例编号">{{patientInfo.orderCode}}</a-descriptions-item>
      <a-descriptions-item label="状态">已出报告</a-descriptions-item>
      <a-descriptions-item label="代谢组结果">{{report.ananpanReportValue}}</a-descriptions-item>
      <a-descriptions-item label="代谢组状态">{{report.ananpanReportValue ? '已完成': '-'}}</a-descriptions-item>
      <a-descriptions-item label="完成日期">{{report.ananpanTime}}</a-descriptions-item>
      <a-descriptions-item label="基因组结果">{{report.geneReportValue}}</a-descriptions-item>
      <a-descriptions-item label="基因组状态">{{report.geneReportValue ? '已完成': '-'}}</a-descriptions-item>
      <a-descriptions-item label="完成日期">{{report.geneTime}}</a-descriptions-item>
      <a-descriptions-item label="影像组结果">{{report.imageReportValue}}</a-descriptions-item>
      <a-descriptions-item label="影像组状态">{{report.imageReportValue ? '已完成': '-'}}</a-descriptions-item>
      <a-descriptions-item label="完成日期">{{report.imageTime}}</a-descriptions-item>
    </a-descriptions>
    <a-divider style="margin-bottom: 32px"/>
    <div class="report-result">
      <a-descriptions title="代谢结果" >
        <a-descriptions-item label="代谢得分">{{report.ananpanReportValue}}</a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="report-result" v-if="report.geneReportValue">
      <a-descriptions title="基因结果" >
        <a-descriptions-item label="得分">{{report.geneReportValue}}</a-descriptions-item>
      </a-descriptions>
    </div>
    <a-divider style="margin-bottom: 32px"/>
    <div class="title">影像结果</div>
    <div class="image-result">
      <div class="image-result-list">
        <div class="image-result-item" v-for="(item, index) in dicomResult.nodulesList" :key="index">
          <a-card :class="{'hight-risk': calcMaligant(item.scrynMaligant)}">
            <dicom-info :item = "item" :title="modelTitle"></dicom-info>
          </a-card>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { getAction, putAction } from '@/api/manage'
import DicomInfo from './template/components/dicom-info'
export default {
  name: 'sampleReportDetail',
  components: {
    DicomInfo
    // STable
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      imageColumns: [
        {
          title: '结节编号',
          dataIndex: 'index',
          key: 'index'
        },
        {
          title: '影像编号',
          dataIndex: 'iamgeNumber',
          key: 'iamgeNumber'
        },
        {
          title: '结节形状',
          dataIndex: 'shape',
          key: 'shape'
        },
        {
          title: '结节大小',
          dataIndex: 'size',
          key: 'size'
        },
        {
          title: '位置',
          dataIndex: 'lung',
          key: 'lung'
        },
        {
          title: '直径',
          dataIndex: 'diameter',
          key: 'diameter'
        },
        {
          title: '平均密度',
          dataIndex: 'avgDensity',
          key: 'avgDensity'
        }
      ],
      patientInfo: {
        sendDate: '20210915',
        detectionMethod: '血液蛋白组学/代谢组学，以及医学影像等多组学技术'
      },
      singature: {
        Inspector: '杨清婷',
        Reviewer: '夏文军',
        reportDate: '2021年9月22日'
      },
      dicomResult: {
        total: 11,
        imageList: []
      },
      report: {},
      ModifyVisible: false,
      mForm: {

      },
      url: {
        commit: '/report/sampleReportSource/Commit',
        queryById: '/report/sampleReportSource/queryById',
        setResult: '/report/sampleReportSource/setResult',
        getPatient: '/multiomics/productOrder/orderStepInfo'
      },
      currImage: null,
      confirmLoading: false,
      defaultImage: require('/src/views/report/template/resource/result.jpg'),
      modelTitle: '',
      patient: {},
      loadData:  false
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        'processing': '进行中',
        'success': '完成',
        'failed': '失败'
      }
      return statusMap[status]
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getSourceDatail()
      // this.getPatient()
    },
    handleMenuClick(e) {
      console.log('click', e)
    },
    async getSourceDatail () {
      const id = this.$route.params.id
      const url = this.url.queryById
      try {
        const postData = {
          id: id
        }
        const res = await getAction(url, postData)
        if (res.code === 200) {
          this.report = res.result.reportInfo
          this.dicomResult = JSON.parse(this.report.imageReportAll)
          this.modelTitle = `窗宽：${this.dicomResult.windowing}  窗位： ${this.dicomResult.windowLevel}`
          this.patientInfo = res.result
          this.patientInfo.sex = res.result.sex ? (res.result.sex === '0' ? '女' : '男') : '-'
          // this.getPatient(this.report.orderId, 0)
          // this.getPatient(this.report.orderId, 1)
          // this.getPatient(this.report.orderId, 2)
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        this.$message.warning(e.message)
      }
    },
    async getPatient(id, step) {
      const url = this.url.getPatient
      try {
        const postData = {
          orderId: id,
          step: step
        }
        const res = await getAction(url, postData)
        if (res.code === 200) {
          if (step === 0) {
            const { caseName, age, sendHospital, sendDoctor, liveHospitalNumber, gender_dictText } = res.result
            this.patient.name = caseName
            this.patient.age = age
            this.patient.sendAgency = sendHospital
            this.patient.sendDoctor = sendDoctor
            this.patient.sex = gender_dictText
            this.patient.patientId = liveHospitalNumber
          } else if (step === 1)  {
            const { medicalCaseCode } = res.result
            this.patient.sampleCode = medicalCaseCode
            this.patientInfo = this.patient
            this.loadData = true
          }
        //   <a-descriptions-item label="临床诊断">{{patientInfo.clinical}}</a-descriptions-item>
        //   <a-descriptions-item label="送检日期">{{patientInfo.sendDate}}</a-descriptions-item>
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        this.$message.warning(e.message)
      }
    },
    async setResult () {
      if (!this.report.id) {
        return false
      }
      const url = this.url.commit
      try {
        const postData = {
          ...this.report
        }
        const res = await putAction(url, postData)
        if (res.code === 200) {
          this.$message.success('确认成功！')
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        this.$message.warning(e.message)
      }
    },
    calcMaligant(value) {
      let retValue = false
      try {
        const numberValue = value.replace('%', '')
        retValue = parseFloat(numberValue) > 60 ? true : false
      } catch (e) {
        console.log(e)
      }
      return retValue
    }
  }
}
</script>
