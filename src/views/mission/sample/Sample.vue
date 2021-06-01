<template>
  <a-card :bordered="false">
    <div class="search-group">
      <div class="group">
        <div class="title">样本编号</div>
        <a-input style="width: 230px" placeholder="请输入样本编号" />
      </div>
      <div class="group">
        <div class="title">批次号</div>
        <a-select style="width: 230px" placeholder="请选择批次号">
          <a-select-option value="shanghai">
            批次号一
          </a-select-option>
          <a-select-option value="beijing">
            批次号二
          </a-select-option>
        </a-select>
      </div>
      <div class="group">
        <div class="title">质控责任人</div>
        <a-select style="width: 230px" placeholder="请选择质控责任人">
          <a-select-option value="shanghai">
            责任人一
          </a-select-option>
          <a-select-option value="beijing">
            责任人二
          </a-select-option>
        </a-select>
      </div>

      <a-button @click="handleSearch" type="primary">搜索</a-button>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">发起样本入库</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        class="j-table-force-nowrap"
        @change="handleTableChange"
      >
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img
            v-else
            :src="getImgView(text)"
            height="25px"
            alt=""
            style="max-width:80px;font-size: 12px;font-style: italic;"
          />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <div class="btn-group">
            <a @click="showDetail(record)">质控</a>
          </div>
        </span>
      </a-table>
    </div>

    <SampleManagementModal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SampleManagementModal from '../modules/sample/SampleManagementModal'
import api from 'src/api/mission/sample'

export default {
  name: 'Sample',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    SampleManagementModal
  },
  data() {
    return {
      description: '样本编号管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '序号',
          align: 'center',
          dataIndex: 'index'
        },
        {
          title: '样本编号',
          align: 'center',
          dataIndex: 'code'
        },
        {
          title: '样本类型',
          align: 'center',
          dataIndex: 'sampleType'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex'
        },
        {
          title: '年龄',
          align: 'center',
          dataIndex: 'age'
        },
        {
          title: '医院名称',
          align: 'center',
          dataIndex: 'hoName'
        },
        {
          title: '性质',
          align: 'center',
          dataIndex: 'codeQuality'
        },
        {
          title: '癌种',
          align: 'center',
          dataIndex: 'typesCancer'
        },
        {
          title: '入库时间',
          align: 'center',
          dataIndex: 'stockInTime'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'state'
        },
        {
          title: '存放位置',
          align: 'center',
          dataIndex: 'location'
        },
        {
          title: '检测时间',
          align: 'center',
          dataIndex: 'time'
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
        list: '/mission/materialManagement/list',
        delete: api.delete,
        deleteBatch: api.deleteBatch,
        exportXlsUrl: api.exportXlsUrl,
        importExcelUrl: api.importExcelUrl
      }
    }
  },
  methods: {
    handleSearch() {},
    showDetail() {}
  }
}
</script>
<style scoped lang="less">
@import '~@assets/less/common.less';

.search-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .group {
    display: flex;
    align-items: center;

    .title {
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
    }
  }
}

.btn-group {
  display: flex;
  justify-content: space-evenly;
}
</style>
