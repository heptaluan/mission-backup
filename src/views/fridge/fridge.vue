<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('样本位置查找')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div class="main-panel">
      <div class="data-panel">
        <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
          <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </div>

        <a-table
          ref="table"
          size="middle"
          :scroll="{x:true}"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          class="j-table-force-nowrap"
          @change="handleTableChange">

          <template slot="htmlSlot" slot-scope="text">
            <div v-html="text"></div>
          </template>
          <template slot="imgSlot" slot-scope="text">
            <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
            <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
          </template>
          <template slot="fileSlot" slot-scope="text">
            <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
            <a-button
              v-else
              :ghost="true"
              type="primary"
              icon="download"
              size="small"
              @click="downloadFile(text)">
              下载
            </a-button>
          </template>

          <span slot="action" slot-scope="text, record">
<!--            <a @click="handleDetail(record)">查看详情</a>-->
            <a @click="handlePosition(record)">存放位置</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>

        </a-table>
      </div>
      <div class="model-panel">
        <model-fridge :width="width" :height="height" v-if="width" ref="fridge"></model-fridge>
        <tube-box :width="width" :height="height" v-if="width" ref="tube"></tube-box>
      </div>
    </div>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import TubeBox from 'src/components/tubebox'
import ModelFridge from 'src/components/tubebox/fridge'
export default {
  name: 'fridge',
  mixins:[JeecgListMixin, mixinDevice],
  components: {
    TubeBox,
    ModelFridge
  },
  data () {
    return {
      description: '冰箱管理管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key:'rowIndex',
          width:60,
          align:"center",
          customRender:function (t,r,index) {
            return parseInt(index)+1;
          }
        },
        {
          title: '样本编号',
          align: 'center',
          dataIndex: 'sampleCode',
          customRender: function(t, r, index) {
            return `${r.caseIdentity}-${r.sampleIdentity}`
          }
        },
        {
          title: '冰箱名称',
          align: 'center',
          dataIndex: 'refrigeratorId'
        },
        {
          title: '研究类型',
          align: 'center',
          dataIndex: 'researchType_dictText'
        },
        {
          title: '样本类型',
          align: 'center',
          dataIndex: 'sampleType_dictText'
        },
        {
          title: '冰箱层数',
          align: 'center',
          dataIndex: 'floor'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: "/mission/caseSample/list",
        delete: "/mission/refrigeratorManagement/delete",
        deleteBatch: "/mission/refrigeratorManagement/deleteBatch",
        exportXlsUrl: "/mission/refrigeratorManagement/exportXls",
        importExcelUrl: "mission/refrigeratorManagement/importExcel"
      },
      dictOptions:{},
      superFieldList:[],
      width: 0,
      height: 0,
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  mounted () {
    this.width = 600
    this.height = (window.innerHeight - 190) / 2
  },
  methods: {
    initDictConfig(){
    },
    handlePosition (record) {
      this.$refs['fridge'].findFirdge(record)
      this.$refs['tube'].findTube(record)
    }
  },
  beforeDestroy () {
    this.renderer.forceContextLoss()
    this.renderer = null
  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less';
  .main-panel {
    display: flex;
    height: calc( 100vh - 40px - 40px - 48px - 59px);
  }
  .data-panel {
    flex: 1;
  }
  .model-panel {
    width: 600px;
  }
</style>
