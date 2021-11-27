<template>
<div class="conclusion">
  <h3 class="conclusion-title">一、检测结论</h3>
  <div class="conclusion-content">
    <p>{{conclusion.description}}<a-checkbox-group :options="riskLevel" :value="risk" @change="onChange" />。{{conclusion.hint}}</p>
    <p v-html="conclusion.content" class="text-blue"></p>
  </div>
</div>
</template>

<script>
import { conclusion } from '../resource/constant'
export default {
  name: 'conclusion',
  data () {
    return {
      riskLevel: ['高风险', '中风险', '低风险'],
      risk: ['高风险'],
      conclusion
    }
  },
  methods: {
    onChange () {
      return false
    }
  }
}
</script>
