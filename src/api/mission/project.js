/**
 * Created by 9I
 * @Date 2021/4/8
 * @description
 */
import { getAction, postAction, putAction, uploadAction} from '@/api/manage'
const prefix = '/mission/projectInfo'

const api = {
  list: prefix + '/list',
  detail: prefix + '/queryById',
  add: prefix + '/add',
  put: prefix + '/edit',
  deleteBatch: prefix + '/deleteBatch',
  delete: prefix + '/delete',
  exportXlsUrl: prefix + '/exportXls',
  importExcelUrl: prefix + '/importExcelUrl'
}

export const queryOwnershipType = (params) => getAction('/mission/fileInfo/list', params)
export const queryGroup = (params) => getAction('/mission/projectGroup/list', params)
export const queryChargePeople = (params) => getAction('/mission/contactManage/list', params)
export const queryCooperationAgency = (params) => getAction('/mission/cooperationAgency/list', params)
export const queryProjectCooperationAgency = (params) => postAction('/mission/cooperationAgency/queryProject', params)
export const queryFileList = (params) => getAction('mission/fileInfo/list', params)
export const queryByIdStockIn = (params) => getAction('/mission/materialManagement/stock/applyDetail/list', params)
// add
export const addProjectCooperation = (params) => postAction('/mission/cooperationAgency/project', params)
// put
export const putProjectStep = (step, params) => putAction(`/mission/projectInfo/${step}/info`, params)

// 项目标准
export const queryById = (params) => getAction('/mission/projectInfo/queryById', params)

// 样本规划
export const getProjectSample = (params) => getAction('/mission/projectSample/project', params)
export const addProjectSample = (params) => postAction('/mission/projectSample/add', params)

// 项目合作单位查询
export const queryProject = (params) => postAction('/mission/cooperationAgency/queryProject', params)

// 耗材出入库-申请出库
export const leaveApply = (params) => postAction('/mission/materialManagement/stock/leaveApply', params)
export const applyDetail = (params) => getAction('/mission/materialManagement/stock/applyDetail/list', params)

// upload file
export const uploadFile = (params) => uploadAction('/mission/fileInfo/add', params)
// 耗材入库
export const stockComeApply = (params) => postAction('/mission/materialManagement/stock/comeApply', params)

// 耗材出入库-出入库申请表审批
export const approve = (params) => postAction('/mission/materialManagement/stock/apply/approve', params)

export default api