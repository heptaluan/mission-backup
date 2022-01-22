<template>
  <a-card :bordered="false" class="report-detail">
    <a-descriptions title="用户信息">
      <a-descriptions-item label="用户姓名">{{patientInfo.name}}</a-descriptions-item>
      <a-descriptions-item label="年龄">{{patientInfo.age}}</a-descriptions-item>
      <a-descriptions-item label="样本编号">{{patientInfo.orderCode}}</a-descriptions-item>
      <a-descriptions-item label="性别">{{patientInfo.sex}}</a-descriptions-item>
      <a-descriptions-item label="住 院 号">{{patientInfo.patientId}}</a-descriptions-item>
      <a-descriptions-item label="送检医师">{{patientInfo.sendDoctor}}</a-descriptions-item>
      <a-descriptions-item label="临床诊断">{{patientInfo.clinical}}</a-descriptions-item>
      <a-descriptions-item label="送检单位">{{patientInfo.sendHospital}}</a-descriptions-item>
      <a-descriptions-item label="送检日期">{{patientInfo.createTime}}</a-descriptions-item>
<!--      <a-descriptions-item label="检测方法">{{patientInfo.detectionMethod}}</a-descriptions-item>-->
    </a-descriptions>
    <a-divider style="margin-bottom: 32px"/>
    <a-descriptions title="订单信息">
      <a-descriptions-item label="订单号">{{report.orderId}}</a-descriptions-item>
      <a-descriptions-item label="病例编号">{{patientInfo.orderCode}}</a-descriptions-item>
      <a-descriptions-item label="状态">已出报告</a-descriptions-item>
      <a-descriptions-item label="代谢结果">{{report.ananpanReportValue}}</a-descriptions-item>
      <a-descriptions-item label="代谢状态">{{report.ananpanReportValue ? '已完成': '-'}}</a-descriptions-item>
      <a-descriptions-item label="完成日期">{{report.ananpanTime}}</a-descriptions-item>
      <a-descriptions-item label="表观结果">{{report.geneReportValue}}</a-descriptions-item>
      <a-descriptions-item label="表观状态">{{report.geneReportValue ? '已完成': '-'}}</a-descriptions-item>
      <a-descriptions-item label="完成日期">{{report.geneTime}}</a-descriptions-item>
      <a-descriptions-item label="影像结果">{{report.imageReportValue}}</a-descriptions-item>
      <a-descriptions-item label="影像状态">{{report.imageReportValue ? '已完成': '-'}}</a-descriptions-item>
      <a-descriptions-item label="完成日期">{{report.imageTime}}</a-descriptions-item>
    </a-descriptions>
    <a-divider style="margin-bottom: 32px"/>
    <div class="report-result">
      <a-descriptions title="代谢结果" >
        <a-descriptions-item label="肺癌">{{report.ananpanReportValue}}</a-descriptions-item>
      </a-descriptions>
    </div>
    <a-divider style="margin-bottom: 16px"/>
    <div class="report-result" v-if="report.geneReportValue">
      <a-descriptions title="表观结果" >
        <a-descriptions-item label="得分">{{report.geneReportValue}}</a-descriptions-item>
      </a-descriptions>
    </div>
    <a-divider style="margin-bottom: 16px" v-if="report.geneReportValue"/>
    <div class="report-result">
      <a-descriptions title="影像结果" >
        <a-descriptions-item label="影像结果">{{report.imageReportValue}}</a-descriptions-item>
      </a-descriptions>
      <div class="edit-toolbar-save">
        <a-button @click="setResult()">保存</a-button>
      </div>
    </div>
    <div class="nodules-panel">
      <div class="image-table" v-for="(item, index) in rowNodulesList">
      <div class="image-row b-flex-1" v-for="nodule in item.list" :key="nodule.label">
        <div class="image-col">
         <span v-html= "nodule.label"></span>
        </div>
        <div class="image-col" v-if="nodule.nodules" :class="{'hight-risk': calcMaligant(nodule.value)}">
          <span v-html="fixMaligant(nodule.value)"></span>
        </div>
        <div class="image-col" v-if="nodule.inputScore">
          <a-input-number v-model="inputScore" :min="1" :max="100" @change="handleChange" />
        </div>
        <div class="image-col" v-if="nodule.finalScore">
          <span v-html="finalScore"></span>
        </div>
      </div>
<!--      <div class="image-row b-flex-2">-->
<!--        <div class="image-col" >-->
<!--          <span>综合得分</span>-->
<!--        </div>-->
<!--        <div class="image-col">-->
<!--          <a-input-number v-model="inputScore" :min="1" :max="100" @change="handleChange" />-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="image-row b-flex-1">-->
<!--        <div class="image-col" >-->
<!--          <span>代谢得分</span>-->
<!--        </div>-->
<!--        <div class="image-col">-->
<!--          <span v-html="finalScore"></span>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    </div>
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
  import { getAction, postAction } from '@/api/manage'
  import DicomInfo from './template/components/dicom-info'
  export default {
    name: 'sampleReportCheckDetail',
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
          queryById: '/report/sampleReportSource/querySById',
          setResult: '/report/sampleReportSource/setResult',
          getPatient: '/multiomics/productOrder/orderStepInfo',
          saveAPF: '/report/sampleReportSource/saveAPF'
        },
        currImage: null,
        confirmLoading: false,
        defaultImage: require('/src/views/report/template/resource/result.jpg'),
        modelTitle: '',
        patient: {},
        loadData:  false,
        inputScore: '',
        finalScore: '',
        rowNodulesList: []
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
            this.report = res.result.report
            this.dicomResult = JSON.parse(this.report.imageReportAll)
            this.modelTitle = `窗宽：${this.dicomResult.windowing}  窗位： ${this.dicomResult.windowLevel}`
            this.patientInfo = res.result.info
            this.patientInfo.sex = res.result.info.sex ? (res.result.info.sex === '0' ? '女' : '男') : '-'
            this.inputScore = this.patientInfo.reportValue
            this.finalScore = this.patientInfo.ananpanReportValue
            this.prossesData(this.dicomResult )
          } else {
            this.$message.error(res.message)
          }
        } catch (e) {
          this.$message.warning(e.message)
        }
      },
      prossesData(dicomResult) {
        this.rowNodulesList = []
        if (!dicomResult.nodulesList) {
          return false
        }
        if (dicomResult.nodulesList.length === 0) {
          return false
        }
        const nodulesList = dicomResult.nodulesList.map(o=>{
          return {
            label: '结节' + o.index,
            value: o.scrynMaligant,
            nodules: true
          }
        })
        nodulesList.push({
          label: '综合得分',
          value: this.inputScore,
          inputScore:  true
        })
        nodulesList.push({
          label: '代谢得分',
          value: this.finalScore,
          finalScore:  true
        })
        // 分行
        const preRow = 12
        for (let i = 0 ; i< nodulesList.length; i++) {
            let row = Math.floor(i / preRow)
            console.log(row)
            const rowRecord = this.rowNodulesList[row]
            if(!rowRecord) {
              rowRecord = {
                row: row,
                list: []
              }
              this.rowNodulesList[row] = rowRecord
            }
            const {label, value, nodules, inputScore, finalScore} = nodulesList[i]
            rowRecord.list.push({
              label: label,
              value: value,
              nodules: nodules,
              inputScore,
              finalScore
            })
          }
        console.log(this.rowNodulesList)
      },
      fixMaligant (value) {
        let retValue = 0
        try {
          const numberValue = value.replace('%', '')
          retValue = parseFloat(numberValue).toFixed(0)
        } catch (e) {
          console.log(e)
        }
        return retValue + '%'
      },
      async setResult () {
        if (!this.report.id) {
          return false
        }
        const reportAll =  this.inputScore * 1
        if (reportAll <= 0 || reportAll > 100) {
          this.$message.success('输入数值必须在1-100范围内！')
          return false
        }
        const url = this.url.saveAPF
        try {
          const postData = {
            reportId: this.report.id,
            reportAll: this.inputScore,
            name: this.patientInfo.name,
            imageValue: this.report.imageReportValue,
            aapValue: this.finalScore,
            orderCode: this.patientInfo.orderCode
          }
          const res = await postAction(url, postData)
          if (res.code === 200) {
            this.$message.success('保存成功！')
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
      },
      handleChange (value){
        if(!value) {
          return false
        }
        const sore = value * 1
        const { imageReportValue, ananpanReportValue, geneReportValue, production} = this.report
        // 斐盼安
        if (!geneReportValue) {
          // Z = R（综合得分）* 1.2 - L * 0.2
          const image = imageReportValue > 60 ? (imageReportValue - 60)* 3 / 4 + 70 : imageReportValue * 7 / 6
          this.finalScore = (sore * 1.2 - image * 0.2).toFixed(2)
        } else {
          const image = imageReportValue > 60 ? (imageReportValue - 60)* 3 / 4 + 70 : imageReportValue * 7 / 6
          const gene = geneReportValue > 60 ? (geneReportValue - 60)* 3 / 4 + 70 : geneReportValue * 7 / 6
          this.finalScore = (sore * 1.4 - image * 0.2 - gene * 0.2).toFixed(2)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.edit-toolbar-save {
  position: absolute;
  top: 0;
  right: 30px;
}
</style>

