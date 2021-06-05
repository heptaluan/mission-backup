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

// 文件上传
export const uploadFile = (params) => uploadAction('/mission/fileInfo/add', params)

// ================================================= 新建项目

// 项目合作关系添加
export const addProjectCooperation = (params) => postAction('/mission/cooperationAgency/project', params)

// 新建项目保存
export const putProjectStep = (step, params) => putAction(`/mission/projectInfo/${step}/info`, params)

// 项目基本信息管理-通过id查询
export const queryById = (params) => getAction('/mission/projectInfo/queryById', params)

// 项目-分页列表查询
export const querypProjectInfo = (params) => getAction('/mission/projectInfo/list', params)

// 项目样本管理-通过项目id查询
export const getProjectSample = (params) => getAction('/mission/projectSample/project', params)

// 项目样本管理-添加
export const addProjectSample = (params) => postAction('/mission/projectSample/add', params)

// 项目合作单位查询
export const queryProject = (params) => postAction('/mission/cooperationAgency/queryProject', params)

// 项目耗材管理-分页列表查询
export const getProjectMaterialList = (params) => getAction('/mission/projectMaterial/list', params)

// 项目每人份耗材管理-分页查询
export const getProjectMaterialPlanList = (params) => getAction('/mission/projectMaterial/plan/list', params)

// ================================================= 耗材管理

// 耗材出入库-申请出库
export const leaveApply = (params) => postAction('/mission/materialManagement/stock/leaveApply', params)

// 耗材出入库-查看出入库申请单详情
export const applyDetail = (params) => getAction('/mission/materialManagement/stock/applyDetail/list', params)

// 耗材出入库-申请入库
export const stockComeApply = (params) => postAction('/mission/materialManagement/stock/comeApply', params)

// 耗材出入库-出入库申请表审批
export const approve = (params) => postAction('/mission/materialManagement/stock/apply/approve', params)

// ================================================= 样本管理

// 病例样本入库-新增样本入库（文件上传）
export const caseSampleUploadFile = (params) => uploadAction('/mission/caseSample/stockApply/add', params)

// 样本入库单对应的审计报告-通过入库单id查询
export const getStockApplyQc = (params) => getAction('/mission/caseSample/stockApply/qc', params)

// 病例单个样本-qc
export const caseSampleQc = (params) => postAction('/mission/caseSample/qc', params)

// 病例单个样本-qc
export const putStockApplyQc = (step, params) => putAction(`/mission/caseSample/stockApply/qc`, params)

// 病例样本信息-分页列表查询
export const getCaseSampleList = (params) => getAction('/mission/caseSample/list', params)

export default api