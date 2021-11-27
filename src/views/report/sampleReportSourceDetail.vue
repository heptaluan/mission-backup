<template>
  <a-card :bordered="false" class="report-detail">
    <a-descriptions title="用户信息">
      <a-descriptions-item label="用户姓名">{{patientInfo.name}}</a-descriptions-item>
      <a-descriptions-item label="年龄">{{patientInfo.age}}</a-descriptions-item>
      <a-descriptions-item label="样本编号">{{patientInfo.sampleCode}}</a-descriptions-item>
      <a-descriptions-item label="性别">{{patientInfo.sex}}</a-descriptions-item>
      <a-descriptions-item label="住 院 号">{{patientInfo.patientId}}</a-descriptions-item>
      <a-descriptions-item label="送检医师">{{patientInfo.sendDoctor}}</a-descriptions-item>
      <a-descriptions-item label="临床诊断">{{patientInfo.clinical}}</a-descriptions-item>
      <a-descriptions-item label="送检单位">{{patientInfo.sendAgency}}</a-descriptions-item>
      <a-descriptions-item label="送检日期">{{patientInfo.sendDate}}</a-descriptions-item>
      <a-descriptions-item label="检测方法">{{patientInfo.detectionMethod}}</a-descriptions-item>
    </a-descriptions>
    <a-divider style="margin-bottom: 32px"/>
    <a-descriptions title="订单信息">
      <a-descriptions-item label="订单号">1000000000</a-descriptions-item>
      <a-descriptions-item label="病例编号">1000000000</a-descriptions-item>
      <a-descriptions-item label="状态">已出报告</a-descriptions-item>
      <a-descriptions-item label="代谢组结果">{{report.ananpan.LC}}</a-descriptions-item>
      <a-descriptions-item label="代谢组进度">已出报告</a-descriptions-item>
      <a-descriptions-item label="报告日期">{{report.reportDate}}</a-descriptions-item>
      <a-descriptions-item label="基因组结果">中风险</a-descriptions-item>
      <a-descriptions-item label="基因组状态">已出报告</a-descriptions-item>
      <a-descriptions-item label="报告日期">{{report.reportDate}}</a-descriptions-item>
      <a-descriptions-item label="影像组结果">中风险</a-descriptions-item>
      <a-descriptions-item label="影像组状态">已出报告</a-descriptions-item>
      <a-descriptions-item label="报告日期">{{report.reportDate}}</a-descriptions-item>
    </a-descriptions>
    <a-divider style="margin-bottom: 32px"/>
    <div class="report-result">
      <span class="status-label">中风险</span>
      <a-descriptions title="代谢结果" >
        <a-descriptions-item label="肺癌">{{report.ananpan.LC}}</a-descriptions-item>
      </a-descriptions>
    </div>
    <a-divider style="margin-bottom: 32px"/>
    <div class="title">影像结果</div>
    <div class="image-result">
      <div class="image-result-list">
        <div class="image-result-item" v-for="(item, index) in dicomResult.imageList" :key="index">
          <a-card :class="{'hight-risk': item.risk >= 60}">
            <div class="image-result-item__content">
              <div class="item-content-image">
                <img :src="item.url" class="result-image">
              </div>
              <div class="item-content-info">
                <div class="title">AI影像表观</div>
                <div class="item-info-row">
                  <label>影像层:</label>
                  <span v-html="item.iamgeNumber"></span>
                </div>
                <div class="item-info-row">
                  <label>肺:</label>
                  <span v-html="item.lung"></span>
                </div>
                <div class="item-info-row">
                  <label>肺叶:</label>
                  <span v-html="item.lungLobe"></span>
                </div>
                <div class="item-info-row">
                  <label>大小:</label>
                  <span v-html="item.size"></span>
                </div>
                <div class="item-info-row">
                  <label>体积:</label>
                  <span v-html="item.volume + 'mm³'"></span>
                </div>
                <div class="item-info-row">
                  <label>形态类型:</label>
                  <span v-html="item.shape"></span>
                </div>
                <div class="item-info-row">
                  <label>标准直径:</label>
                  <span v-html="item.diameter + 'mm'"></span>
                </div>
                <div class="item-info-row">
                  <label>恶性风险:</label>
                  <span v-html="item.risk + '%'"></span>
                </div>
                <div class="item-info-row">
                  <label>中心密度:</label>
                  <span v-html="item.centerDensity + 'HU'"></span>
                </div>
                <div class="item-info-row">
                  <label>平均密度:</label>
                  <span v-html="item.avgDensity + 'HU'"></span>
                </div>
                <div class="item-info-row">
                  <label>最大密度:</label>
                  <span v-html="item.maxDensity + 'HU'"></span>
                </div>
                <div class="item-info-row">
                  <label>最小密度:</label>
                  <span v-html="item.minDensity + 'HU'"></span>
                </div>
              </div>
            </div>
          </a-card>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'sampleReportDetail',
  components: {
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
      report: {
        reportDate: '2021-11-03',
        ananpan:{
          LC: '57.6',
        }
      },
      ModifyVisible: false,
      mForm: {

      },
      url: {
        edit: '/report/sampleReportHistory/edit',
        queryById: '/report/sampleReportSource/queryById'
      },
      validatorRules: {
        lung: [{ required: true, message: '请选择肺!' }],
        lungLobe: [{ required: true, message: '请输入肺叶!' }],
        size: [{ required: true, message: '请输入大小!' }],
        volume: [
          { required: true, message: '请输入体积!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        ],
        shape: [{ required: true, message: '请选择形态类型!' }],
        risk: [{ required: true, message: '请输入风险!' }],
        diameter: [
          { required: true, message: '请输入直径!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        ],
        centerDensity: [
          { required: true, message: '请输入中心密度!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        ],
        avgDensity: [
          { required: true, message: '请输入平均密度!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        ],
        maxDensity: [
          { required: true, message: '请输入最大密度!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        ],
        minDensity: [
          { required: true, message: '请输入最小密度!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        ]
      },
      currImage: null,
      confirmLoading: false
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
      this.dicomResult.imageList = []
      const random = (max) =>{
        return Math.floor(Math.random() * max)
      }
      const randomFix = (max, min = 0) =>{
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
          url: require('/src/views/report/template/resource/result.jpg'),
          diameter: random(1000) / 100,
          minDensity: pn *(randomFix(100, 100)),
          maxDensity: pn *(randomFix(300,700)),
          avgDensity: pn *(randomFix(200, 500)),
          centerDensity: pn *(randomFix(100, 500)),
          shape: getShape(),
          size:  randomFix(10, 0) + 'mm*' + randomFix(10, 0) + 'mm',
          lung: pn > 0 ? '左肺' : '右肺',
          lungLobe: pn > 0 ? '上肺叶' : '下肺叶',
          volume: randomFix(10, 0)
        }
        this.dicomResult.imageList.push(result)
      }
    }
  }
}
</script>
<style lang="less">
  .report-detail {
    .title {
      color: rgba(0, 0, 0, .85);
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 16px;
    }

    .status-label {
      width: 100px;
      text-align: center;
      font-size: 13px;
      line-height: 32px;
      background: #dc5f0d;
      position: absolute;
      right: 0;
      top: 0;
      z-Index: 2;
      padding: 0 2em;
      -webkit-transform-origin: left bottom;
      -moz-transform-origin: left bottom;
      transform-origin: left bottom;
      -webkit-transform: translate(29.29%, -100%) rotate(45deg);
      -moz-transform: translate(29.29%, -100%) rotate(45deg);
      transform: translate(29.29%, -100%) rotate(45deg);
      text-indent: 0;

      &.low-risk {
        background: #5fb679;
      }

      &.hight-risk {
        background: #fe0100;
      }
    }

    .report-result {
      position: relative;
      overflow: hidden;
      height: 75px;
    }

    .image-result {
      &-list {
        display: flex;
        flex-wrap: wrap;
      }

      &-item {
        min-height: 45px;
        flex: 0 0 50%;

        &__content {
          display: flex;
          position: relative;
          border: 2px solid transparent;
        }

        padding-right: 30px;
        margin-bottom: 30px;

        &:hover, &:active {
          .edit-toolbar {
            display: block;
          }
        }

        .ant-card {
          border: 2px solid #e8e8e8;

          &.hight-risk {
            border-color: #fe0100;
          }
        }
      }

      .item-content-image {
        flex: 2;

        .result-image {
          max-width: 100%;
        }
      }

      .item-content-info {
        flex: 1;
        padding: 15px;
      }

      .edit-toolbar {
        position: absolute;
        top: 15px;
        right: 15px;
        display: none;
      }
    }

    .item-info-row {
      margin-bottom: 10px;

      > label {
        font-weight: bold;
        margin-right: 10px;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    .result-image {
      max-width: 100%;
    }

    .ant-modal-body {
      .image-result {
        display: flex;

        .result-image {
          margin-top: 45px;
        }
      }

      .item-info-row {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
