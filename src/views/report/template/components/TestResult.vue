<template>
<div class="test-result">
 <h3>二、检测结果</h3>
 <h4>1. 生化分子组学（蛋白组学/代谢组学）检测结果</h4>
  <div class="test-result-content">
    <p>{{result.content}}<a-checkbox-group :options="result.riskLevel" :value="result.risk" @change="onChange" />。{{result.suggest}}</p>
    <div class="hot-pic">
      <img :src="result.hotpointPic" class="hot-pic-image">
    </div>
    <p v-html="result.interpretation" class="pic-tips"></p>
  </div>
  <h4>2. 医学影像人工智能阅片分析结果</h4>
  <p class="text-indent">人工智能肺小结节筛查引擎，可根据受检者CT影像识别肺窗视图下肺内的结节（<strong>对于纵隔囊肿,肺壁的增厚等检出具有局限性</strong>），同时对检测到的结节进行大小，体积，位置，形态类型等进行判读，并综合分析结节良恶性概率，恶性概率越高，肺部结节恶性风险就越高。</p>
  <p>人工智能阅片分析，该受检者双肺共检出{{dicomResult.total}}个结节（具体信息详见下图），其中1个结节恶性程度评估为高风险（<span class="text-blue">结节恶性风险为：{{dicomResult.risk}}</span>）。具体信息为：</p>
  <p v-for="(item, index) in dicomResult.pulmonaryNodules" :key="index" v-html="item.content"></p>
  <p class="text-indent text-blue" v-html="dicomResult.interpretation"></p>
</div>
</template>

<script>
import { proteinResult, dicomResult } from '../resource/constant'
export default {
  name: 'test-result',
  data () {
    return {
      result: {
        score: 70.8,
        content: '',
        riskLevel: ['高风险（70-100分）', '中风险（50-70分）', '低风险（0-50分）'],
        risk: ['高风险（70-100分）'],
        suggest: proteinResult.high.suggest,
        hotpointPic: 'http://img.ananpan.com/report_img/-yv2VRFZfIN5U6-oVRMJHSgAtKw1QhBHmVbOjRnOjE-GVpkAqy862Kl0WQGszYLB.jpg?imageMogr2/thumbnail/1800x/format/jpg',
        interpretation: proteinResult.interpretation
      },
      dicomResult: {
        total: 11,
        risk: '80%',
        pulmonaryNodules: [{
          nodules: 8,
          content: '结节8：于左肺上叶尖后段影像（IMG45）可见一磨玻璃结节，大小约2.22mm*1.41mm，CT值约-850HU，体积约4mm3。'
        }],
        interpretation: dicomResult.interpretation
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.result.content = `生化分子是生物功能的终端产物，其改变可反映生物体某一特定生理时期内的活动情况，与疾病表型关系也最为密切。蛋白大分子物质和代谢小分子物质都属于生物体内的生化分子。通过对肺癌发生发展中某些显著性差异的内源性分子物质的含量检测，经综合评估，该样本结节良恶性评分为${this.result.score}分，肺结节恶性程度为:`
    },
    onChange () {
      return false
    }
  }
}
</script>
