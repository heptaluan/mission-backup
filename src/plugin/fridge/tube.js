/**
 * Created by 9I
 * @Date 2021/3/18
 * @description
 */
class Tube {
  constructor(option) {
    // 试剂唯一标识id, 对应条码信息
    this.tId = option.tubeId
    // 所在试剂盒id
    this.tubeBoxId = option.tubeBoxId
    // 所在冰箱Id
    this.fId = option.fridageId
    // 名称
    // this.tName = option.tubeBoxName
    // 试剂位置信息
    this.positionX = option.positionX
    this.positionY = option.positionY
    this.positionZ = option.positionZ
    // 试剂长宽高信息
    this.length = option.length
    this.width = option.width
    this.height = option.height
    // 试剂对应订单信息
    this.info = {}
    //  对应试剂盒 行列
    this.store = {
      row: option.row,
      col: option.col,
    }
  }
  // 试剂渲染函数
  render() {}
  UpdateStore(row, col) {
    this.store.row = row
    this.store.col = col
  }
}
export default Tube
