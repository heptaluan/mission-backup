/**
 * Created by 9I
 * @Date 2021/3/17
 * @description
 */
import Fridge from './fridge'
import { GET_FRIDAGE_LIST, FRIDGE_WIDTH, FRIDGE_HEIGHT, FRIDGE_LENGTH } from './data'

class storage {
  constructor(scene) {
    this.scene = scene
    // 缓存所有冰箱
    this.fridgeStore = []
    this.initMaterial()
    this.addFridge()
  }
  // 初始化材质
  initMaterial() {}
  // add fridge
  // 添加冰箱
  addFridge() {
    const fridgeList = GET_FRIDAGE_LIST()
    let width = FRIDGE_WIDTH
    let height = FRIDGE_HEIGHT
    let length = FRIDGE_LENGTH
    for (let i = 0; i < fridgeList.length; i++) {
      let fridgeItem = fridgeList[i]
      let option = {
        fridgeId: fridgeItem.fId,
        fridgeName: fridgeItem.fName,
        positionX: fridgeItem.x,
        positionY: fridgeItem.y,
        positionZ: fridgeItem.z,
        width,
        height,
        length,
      }
      let fridge = new Fridge(option)
      fridge.render(this.scene)
      this.fridgeStore.push(fridge)
    }
  }

  // 第一排 从左往右 158 - 192
  // 第二排 从右往左 194 - 228
  // 第三排 从左往右 对象491 -对象 525
  // 第四层 从右往左 对象527 - 对象 561

  // floor -- 第几层 grid --第几格 drawer 第几个抽屉
  getMeshNameByPosition(floor, grid, drawer) {
    // floor grid drawer 均从1开始
    const direction = floor % 2 ? false : true
    const prefix = floor > 2 ? '对象' : ''
    const drawerMax = 5
    let name = ''
    switch (floor) {
      case 1:
        name = (grid - 1) * drawerMax + drawer - 1 + 158
        break
      case 2:
        name = 228 - (grid - 1) * drawerMax - drawer + 1
        break
      case 3:
        name = prefix + (grid - 1) * drawerMax + drawer - 1 + 491
        break
      case 4:
        name = prefix + (561 - (grid - 1) * drawerMax - drawer + 1)
        break
    }
    return name.toString()
  }
}
export default storage
