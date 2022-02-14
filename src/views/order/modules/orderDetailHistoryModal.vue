<template>
  <j-modal
    :title='title'
    :width='width'
    :visible='visible'
    switchFullscreen
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @ok='handleOk'
    @cancel='handleCancel'
  >
    <!--    <div class="order-progress">-->
    <!--      <div class="label-title b-flex">-->
    <!--        订单进度-->
    <!--        <div class='order-progress-panel'>-->
    <!--          <a-progress :percent='orderProgressValue' :showInfo='false' status='active' />-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="order-progress-table">-->
    <!--        <div class="progress-row" v-for="(item, index) in orderProgressList" :key="index">-->
    <!--          <div class="title">{{ item.title }}</div>-->
    <!--          <div class="text">-->
    <!--            <span :class="{ successStatus: item.status === 1 }">{{ item.text }}</span>-->
    <!--            <a-button v-if="item.showButton && !item.buttonGroup" :disabled="item.disState" size="small"-->
    <!--            >重新取样</a-button-->
    <!--            >-->
    <!--            <template v-if="item.showButton && item.buttonGroup">-->
    <!--              <a-button :disabled="item.disState" size="small">报告审核</a-button>-->
    <!--              <a-button :disabled="item.disState" size="small">签发</a-button>-->
    <!--              <a-button :disabled="item.disState" size="small">预览</a-button>-->
    <!--            </template>-->
    <!--          </div>-->
    <!--          <div class="time">-->
    <!--            <span :class="{ successStatus: item.status === 1 }">{{ item.time }}</span>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <a-form layout='inline' @keyup.enter.native='searchQuery'>
      <a-row :gutter='24' class='search-group order-list'>
        <a-col class='group md'>
          <a-form-item label='历史记录:' :labelCol='{ span: 6 }'>
            <a-select v-model='selectOption' placeholder='请选择记录' allowClear>
              <a-select-option v-for='item in orderProgressList' :key='item.text' :value='item.title'>
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class='order-progress order-progress-child'>
      <div class='label-title'>子订单进度</div>
      <div class='progress-body'>
        <div class='progress-item' v-for='(list, index) in childOrder' :key='index'>
          <div class='progress-item-title'>
            <label class='text-weight'>{{ list.title }}</label>
            <span> 订单号：{{ list.orderId }}</span>
            <!-- <label class="responsible">责任人：</label> -->
            <!-- <span>{{ list.responsible }}</span> -->
          </div>
          <div class='progress-item-body'>
            <a-steps :current='list.step' style='width: 100%' size='small'>
              <a-step v-for='(item, index) in list.data' :key='index'>
                <span slot='title'>{{ item.title }}</span>
                <span slot='description'>
                  <div :class="{ successStatus: item.status === '成功', errorStatus: item.status === '失败' }">
                    状态：{{ item.status }}
                  </div>
                  <div
                    v-if='item.time'
                    :class="{ successStatus: item.status === '成功', errorStatus: item.status === '失败' }"
                  >
                    时间：{{ item.time }}
                  </div>
                </span>
                <span v-if='item.showButton' slot='subTitle'>
                  <a-button
                    :disabled='item.disState'
                    size='small'
                    @click='e => handleSubOrderClick(item, item.omicsMilestone)'
                  >{{ item.buttonText }}</a-button
                  >
                </span>
              </a-step>
            </a-steps>
          </div>
        </div>
      </div>
    </div>
  </j-modal>
</template>

<script>
import { getProductOrderInstance } from '../../../api/order'

export default {
  name: 'orderDetailHistoryModal',
  data() {
    return {
      title: '查看订单历史信息',
      width: 1200,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      record: {},
      orderProgressValue: 0,
      orderProgressList: [],
      childOrder: [],
      selectOption: undefined
    }
  },
  methods: {
    show(baseInfo, orderInfo) {
      this.visible = true
      this.baseInfo = {
        ...orderInfo
      }
      this.fetchInfo()
    },
    handleCancel() {
      this.visible = false
      this.cleanData()
    },
    handleOk() {
      this.visible = false
      this.cleanData()
    },
    handleView(record) {
      console.log(record)
    },
    fetchInfo() {
      const id = this.$route.params.id
      getProductOrderInstance(id).then(res => {
        if (res.code === 200) {
          this.formatInstance(res)
          this.formatSubOrders(res)
        }
      })
    },
    formatInstance(res) {
      const instanceHistoryStates = res.result.instance.historyStates
      instanceHistoryStates.forEach(ele => {
        const oneStep = 25
        if (ele.stateResult == 1) {
          this.orderProgressValue += oneStep
        }
      })
      for (let i = 0; i < instanceHistoryStates.length; i++) {
        this.orderProgressList.push({
          status: instanceHistoryStates[i].stateResult,
          title: instanceHistoryStates[i].productMilestone_dictText,
          text: instanceHistoryStates[i].stateResult_dictText,
          time:
            instanceHistoryStates[i].stateResult === -1
              ? instanceHistoryStates[i].stateResult_dictText
              : instanceHistoryStates[i].updateTime
        })
      }
    },
    formatSubOrders(res) {
      const subOrders = res.result.subOrders
      for (let i = 0; i < subOrders.length; i++) {
        const historyStates = subOrders[i].historyStates.sort(this.compare('omicsMilestone'))
        const step = historyStates.findIndex(item => item.omicsMilestone === subOrders[i].orderState)
        this.childOrder.push({
          omicsAnalysisType: subOrders[i].omicsAnalysisType,
          title: subOrders[i].omicsAnalysisType_dictText,
          orderId: subOrders[i].id,
          responsible: '王大山',
          step: step ? step : 0,
          data: []
        })
        for (let j = 0; j < historyStates.length; j++) {
          if (this.childOrder[i].data) {
            const codeNum = historyStates[j].omicsMilestone
            switch (codeNum) {
              case 10000:
                this.childOrder[i].data.push({
                  omicsMilestone: historyStates[j].omicsMilestone,
                  title: historyStates[j].omicsMilestone_dictText,
                  time: historyStates[j].updateTime,
                  showButton: false,
                  buttonText: '查看报告',
                  disState: historyStates[j].stateResult === 1 ? false : true,
                  status: historyStates[j].stateResult_dictText
                })
                break
              case 3100:
                this.childOrder[i].data.push({
                  omicsMilestone: historyStates[j].omicsMilestone,
                  title: historyStates[j].omicsMilestone_dictText,
                  time: historyStates[j].updateTime,
                  showButton: true,
                  buttonText: historyStates[j].stateResult === 1 ? '查看影像' : '重新归档',
                  disState: historyStates[j].stateResult === 1 ? false : true,
                  status: historyStates[j].stateResult_dictText,
                  omicsOrderId: historyStates[j].omicsOrderId,
                  stateResult: historyStates[j].stateResult
                })
                break
              default:
                this.childOrder[i].data.push({
                  omicsMilestone: historyStates[j].omicsMilestone,
                  title: historyStates[j].omicsMilestone_dictText,
                  time: historyStates[j].updateTime,
                  showButton: false,
                  buttonText: '',
                  disState: false,
                  status: historyStates[j].stateResult_dictText
                })
                break
            }
          }
        }
      }
    },
    compare(p) {
      return function(m, n) {
        return m[p] - n[p]
      }
    },
    handleSubOrderClick(item, omicsMilestone) {
      switch (omicsMilestone) {
        case 3100:
          if (item.stateResult === 1) {
            this.$router.push({
              path: `/viewport/viewportDetail?resource=${item.omicsOrderId}&type=1`
            })
          } else {
            console.log(`重新归档`)
          }
          break

        default:
          console.log(item)
          break
      }
    },
    cleanData() {
      this.record = {},
        this.orderProgressValue = 0,
        this.orderProgressList = [],
        this.childOrder = [],
        this.selectOption = undefined
    }
  }
}
</script>

<style lang='less' scoped>
.top-button-group {
  position: absolute;
  right: 24px;
  top: 24px;

  .ant-btn:nth-child(2) {
    margin: 0 15px;
  }
}

.label-title {
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  font-size: 16px;
  line-height: 1.5;
}

.order-progress-panel {
  margin-left: 15px;
  width: 180px;
}

.order-progress-table {
  width: fit-content;
  width: 100%;
  display: flex;

  .progress-row {
    border: 1px solid #222;
    width: 12.5%;
    border-right: none;

    &:last-child {
      border-right: 1px solid #222;
    }

    .title,
    .text,
    .time {
      height: 42px;
      line-height: 42px;
      text-align: center;
    }

    .time {
      height: initial;
    }


    .text.successStatus,
    .time.successStatus {
      color: rgb(16, 191, 125);
    }

    .text {
      border-top: 1px solid #222;
      border-bottom: 1px solid #222;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
  }
}

.order-progress-child {
  margin-top: 15px;
}

.progress-item-body {
  margin: 30px 0 !important;
}

.progress-item {
  margin-bottom: 15px;

  .responsible {
    margin-left: 15px;
  }

  &-body {
    margin-top: 15px;

    .ant-steps-item {
      margin-right: 0 !important;
    }

    .ant-steps-item-content {
      text-align: left;
    }

    .ant-steps-item-finish {
      .ant-steps-item-icon {
        border-color: #10bf7d;

        > .ant-steps-icon {
          color: #10bf7d;
        }
      }

      > .ant-steps-item-container {
        > .ant-steps-item-content > .ant-steps-item-title {
          color: #10bf7d;
        }
      }

      > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
        background-color: #10bf7d;
      }
    }
  }

  &-status {
    padding: 10px 15px;
  }
}

.successStatus {
  font-size: 13px;
  color: #10bf7d;
}

.errorStatus {
  font-size: 13px;
  color: #f5222d;
}
</style>