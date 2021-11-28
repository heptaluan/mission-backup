import { getAction, postAction, putAction, deleteAction } from '@/api/manage'

// 获取产品列表
export const getProductInfoList = (params) => getAction('mission/productInfo/list', params)

// 添加产品
export const addProductInfoList = (params) => postAction('mission/productInfo/add', params)

// 编辑产品
export const updateProductInfoList = (params) => putAction('mission/productInfo/edit', params)

// 产品样本绑定
export const bindSample = (params) => putAction('mission/productInfo/bindSample', params)

// 上传 LOGO
export const uploadLogo = (params) => postAction('mission/productInfo/logoUpload', params)

// 渠道商管理 添加
export const addBusinessAccess = (params) => postAction('mission/businessAccess/add', params)

// 添加渠道隶属医院
export const addBusinessHospital = (params) => postAction('mission/businessAccess/addBusinessHospital', params)

// 渠道商列表
export const getDistributorList = (params) => getAction('mission/businessAccess/list', params)

// 医院主表ID查询
export const queryHospitalByMainId = (params) => getAction('mission/businessAccess/queryHospitalByMainId', params)

// 产品适配耗材查询
export const fitProduct = (params) => postAction('mission/materialManagement/fitProduct', params)