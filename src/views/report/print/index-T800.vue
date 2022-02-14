<template>
  <div class="bg-gray">
    <div class="preview-container">
      <page-common :pageConfig="pageConfig" pageIndex="1">
        <div class="page-overview">
          <h3 class="report-title text-center text-weight">肺结节良恶性检测报告</h3>
          <patient-info :data="patientInfo" v-if="loadData"></patient-info>
          <conclusion :data="report"></conclusion>
          <conclusion-result :data="report"></conclusion-result>
<!--          <signature :data="singature"></signature>-->
        </div>
      </page-common>
    </div>
    <a-button @click="handleOnePrint" class="printBtn printBtn3 noprint">下载报告</a-button>
  </div>
</template>

<script>
import PatientInfo from '../template/components/patientInfo'
import Conclusion from '../template/components/conclusion'
import ConclusionResult from '../template/components/conclusion-result'
import Signature from '../template/components/signature'
import Explain from '../template/components/explain'
import PageExplain from '../template/components/page-explain-t'
import PageCommon from './components/page-common'
import { getAction } from '@/api/manage'
import * as dayjs from 'dayjs'
export default {
  name: 'report-T800',
  components: { PageCommon, Explain, Signature, ConclusionResult, Conclusion, PatientInfo, PageExplain },
  data() {
    return {
      patientInfo: {},
      singature: {
        reportDate: '2021年9月22日'
      },
      dicomResult: {
        total: 11,
        imageList: []
      },
      imagePage: [],
      riskPage: [],
      pageConfig: {
        isNoFooter: false
      },
      report: {},
      pageLast: 3,
      url: {
        queryById: '/report/sampleReportResult/queryById',
        getPatient: '/multiomics/productOrder/orderStepInfo'
      },
      defaultImage: require('/src/views/report/template/resource/result.jpg'),
      testResult: {
        pulmonaryNodules: undefined
      },
      pulmonaryNodules: undefined,
      patient: {},
      loadData:  false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getDatailById()
    },
    async getDatailById () {
      const id = this.$route.params.reportId
      const url = this.url.queryById
      try {
        const postData = {
          id: id
        }
        const res = await getAction(url, postData)
        if (res.code === 200) {
          this.report = res.result.reportInfo
          this.dicomResult = JSON.parse(this.report.imageReportAll)
          this.testResult = {
            ...res.result.reportInfo
          }
          this.report.choseProduct = res.result.choseProduct
          this.singature.reportDate = this.report.resultTime
          this.modelTitle = `窗宽：${this.dicomResult.windowing}  窗位： ${this.dicomResult.windowLevel}`
          this.patientInfo = res.result
          this.patientInfo.sex = res.result.sex ? (res.result.sex === '0' ? '女' : '男') : '-'
          const time = this.getDate(this.report.resultTime)
          const name = this.patientInfo.name
          const riskText = this.report.reportValue >= 70 ? '高风险' : (this.report.reportValue >= 50 ? '中风险' : '低风险')
          document.title = `肺结节良恶性鉴别检测_${name}_${time}_${riskText}`
          this.loadData = true
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        this.$message.warning(e.message)
      }
    },
    handleOnePrint () {
      window.print()
    },
    getDate (time) {
      const pattern = 'YYYYMMDD'
      return dayjs(time).format(pattern)
    }
  }
}
</script>
<style lang="less">
  @import "../less/print.less";
</style>
