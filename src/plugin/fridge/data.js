/**
 * Created by 9I
 * @Date 2021/3/18
 * @description
 */
export const FRIDGE_LENGTH = 80  //冰箱长度
export const FRIDGE_WIDTH = 68   //冰箱宽度
export const FRIDGE_HEIGHT = 180   //冰箱高度
export const TUBE_BOX_LENGTH = 40  //试剂盒子长度
export const TUBE_BOX_WIDTH = 24   //试剂盒子宽度
export const TUBE_BOX_HEIGHT = 7.5 //试剂盒子高度
export const FLOOR_NUM = 4     //冰箱层数
// 每层立体摆放 4 * 3 * 3  4行3列 摆放三层
export const ROW_NUM = 1      //冰箱每层行数
export const COLUMN_NUM = 6     //冰箱每层列数
export const LAYER_NUM = 3      // 冰箱每层 层数
// const TUBE_SIZE = 2      //  试管半径
// const TUBE_HEIGHT = 10   // 试管高度
// const TUBE_COL = 10     // 试剂盒里面行列数  暂定 10* 10
// const TUBE_ROW = 10      // 试剂盒里面行行数
// 试管 列数组
export const COL_ARRAY = ['A','B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

//冰箱数组
export const fridage_list = new Array()
fridage_list.push({StorageZoneId: 'Z1', fId: 'F1', fName: '冰箱F1', x: -300, y: 27, z: 0})
fridage_list.push({StorageZoneId: 'Z1', fId: 'F2', fName: '冰箱F2', x: 0, y: 27, z: 0})
fridage_list.push({StorageZoneId: 'Z1', fId: 'F3', fName: '冰箱F3', x: 300, y: 27, z: 0})

export function GET_FRIDAGE_LIST () {
  return fridage_list
}
