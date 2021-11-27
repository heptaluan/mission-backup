<template>
<div class="risk-chart">
  <h4 v-html="title"></h4>
  <div class="risk-content">
    <div class="risk-progress text-center">
       <a-progress stroke-linecap="square" :percent="data.risk" type="dashboard" :strokeColor = "getStatus(data.risk)" :width="width"/>
       <p v-html="getStatusText(data.risk)" class="text-center text-weight"></p>
       <h-progress :progress="data.avgDensity"></h-progress>
       <p class="text-orange">密度：{{data.avgDensity}}HU</p>
     </div>
    <div class="risk-diameter">
      <diameter :diameter="data.diameter"></diameter>
    </div>
  </div>
</div>
</template>

<script>
  import HProgress from './hProgress'
  import Diameter from './diameter'
  export default {
    name: 'risk-chart',
    components: { Diameter, HProgress },
    props: {
      data: {
        type: Object,
        require: true
      }
    },
    data () {
      return {
        width: 100
      }
    },
    computed: {
      title () {
        const { data } = this
        return `结节${data.index}:${data.lung}${data.lungLobe}<span class="text-orange">${data.shape}</span>`
      }
    },
    methods: {
      getStatusText (risk) {
        let status = '低风险'
        if (risk < 70 ) {
          status = '低风险'
        }
        // if (risk < 70 && risk >=50 ) {
        //   status = '低风险'
        // }
        if (risk >= 70 ) {
          status = '高风险'
        }
        return status
      },
      getStatus (risk) {
        let status = '低风险'
        if (risk < 70 ) {
          status = '#5fb679'
        }
        if (risk < 70 && risk >=50 ) {
          status = '#dc5f0d'
        }
        if (risk >= 70 ) {
          status = '#fe0100'
        }
        return status
      }
    }
  }
</script>