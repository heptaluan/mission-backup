/**
 * Created by 9I
 * @Date 2021/3/18
 * @description 试管盒子相关类
 */
class TubeBox {
  constructor (option) {
    // 盒子唯一标识id
    this.tId = option.tubeBoxId
    // 所在冰箱Id
    this.fId = option.fridageId
    // 名称
    this.tName = option.tubeBoxName
    // 试剂盒位置信息
    this.positionX = option.positionX
    this.positionY = option.positionY
    this.positionZ = option.positionZ
    // 试剂盒长宽高信息
    this.length = option.length
    this.width = option.width
    this.height = option.height
    // 在冰箱对应位置
    this.floor = option.floor
    this.store = {
      row : option.row,
      col: option.col,
      floor: option.boxFloor
    }
  }
  // 试剂盒渲染函数
  render () {

  }
  // 试剂盒弹出
  openDoor () {
    // todo
  }
}
export default TubeBox
