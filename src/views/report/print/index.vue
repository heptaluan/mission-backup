<template>
  <div class="bg-gray">
    <div class="preview-container">
      <page-common :pageConfig="pageConfig" pageIndex="1">
        <div class="page-overview">
          <h3 class="report-title text-center text-weight">肺结节良恶性检测报告</h3>
          <patient-info :data="patientInfo"></patient-info>
          <conclusion></conclusion>
          <conclusion-result></conclusion-result>
          <signature :data="singature"></signature>
        </div>
      </page-common>
      <page-common :pageConfig="pageConfig" pageIndex="2">
        <test-result class="page-content"></test-result>
      </page-common>
<!--      <div class="page">-->
<!--        <dicom-result :data="dicomResult.imageList" v-if="dicomResult.imageList.length"></dicom-result>-->
<!--        <dicom-evaluation :data="dicomResult.imageList" v-if="dicomResult.imageList.length"></dicom-evaluation>-->
<!--      </div>-->
      <page-common :pageConfig="pageConfig" :pageIndex="index + 3" v-for="(page, index) in imagePage" :key="index + 3" v-if="imagePage.length">
        <dicom-result :data="page.image" v-if="page.image.length" class="page-content"></dicom-result>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="index + imagePage.length + 3" v-for="(page, index) in riskPage" :key="index + imagePage.length + 3" v-if="riskPage.length">
        <h3 class="text-orange evaluation-title" v-if="index === 0">AI（人工智能）结节恶性概率评估</h3>
        <dicom-evaluation :data="page.image" v-if="page.image.length" class="page-content"></dicom-evaluation>
      </page-common>
      <page-common :pageConfig="pageConfig" :pageIndex="pageLast">
        <explain class="page-content"></explain>
      </page-common>
    </div>
  </div>
</template>

<script>
  import PatientInfo from '../template/components/patientInfo'
  import Conclusion from '../template/components/conclusion'
  import ConclusionResult from '../template/components/conclusion-result'
  import Signature from '../template/components/signature'
  import TestResult from '../template/components/TestResult'
  import DicomResult from '../template/components/dicomResult'
  import DicomEvaluation from '../template/components/dicomEvaluation'
  import Explain from '../template/components/explain'
  import PageCommon from './components/page-common'
  export default {
    name: 'print-preview',
    components: { PageCommon, Explain, DicomEvaluation, DicomResult, TestResult, Signature, ConclusionResult, Conclusion, PatientInfo },
    data() {
      return {
        patientInfo: {
          name: '曹湧',
          age: '52',
          sampleCode: 'P02LA336',
          sex: '女',
          patientId: 'PCT0002145',
          sendDoctor: '张伞',
          clinical: '肺结节',
          sendAgency: '山东省胸科医院',
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
        imagePage: [],
        riskPage: [],
        pageConfig: {
          isNoFooter: false
        },
        pageLast: 3
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.dicomResult.imageList = []
        const random = (max) => {
          return Math.floor(Math.random() * max)
        }
        const randomFix = (max, min) =>{
          const _random = Math.floor(Math.random() * max * 100 + min * 100) / 100

          return _random
        }
        const getShape = ()=> {
          const shapeArr = ['胸膜钙化', '磨玻璃', '肺内实性']
          const index = Math.floor(Math.random() * 3)
          return shapeArr[index]
        }
        for (let i = 0; i < this.dicomResult.total; i++) {
          const _random = random(50) + 20
          const pn = _random % 2 === 0 ? 1 : -1
          const result = {
            index: i + 1,
            iamgeNumber: _random + i,
            risk: _random,
            url: require('../template/resource/dicom_result.png'),
            diameter: random(1000) / 100,
            minDensity: pn *(randomFix(100, 100)),
            maxDensity: pn *(randomFix(300,700)),
            avgDensity: pn *(randomFix(200, 500)),
            centerDensity: pn *(randomFix(100, 500)),
            shape: getShape(),
            size:  randomFix(10) + '*' + randomFix(10),
            lung: pn > 0 ? '左肺' : '右肺',
            lungLobe: pn > 0 ? '上肺叶' : '下肺叶'
          }
          this.dicomResult.imageList.push(result)
        }
        // 分页
        for (let i = 0; i < this.dicomResult.total; i++) {
          const Image = this.dicomResult.imageList[i]
          let imagePageIndex = Math.floor(i / 3) + 1
          let riskPageIndex = Math.floor(i / 4) + 1
          if (imagePageIndex > this.imagePage.length) {
            const imagePage = {
              pageIndex: imagePageIndex,
              image: []
            }
            imagePage.image.push(Image)
            this.imagePage.push(imagePage)
          } else {
            this.imagePage[imagePageIndex - 1].image.push(Image)
          }
          if (riskPageIndex > this.riskPage.length) {
            const imagePage = {
              pageIndex: riskPageIndex,
              image: []
            }
            imagePage.image.push(Image)
            this.riskPage.push(imagePage)
          } else {
            this.riskPage[riskPageIndex - 1].image.push(Image)
          }
        }
        this.pageLast = 3 + this.riskPage.length + this.imagePage.length
      }
    }
  }
</script>
<style lang="less">
  @import "../less/print.less";
</style>
