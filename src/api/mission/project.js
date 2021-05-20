/**
 * Created by 9I
 * @Date 2021/4/8
 * @description
 */
import { getAction} from '@/api/manage'
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
export default api