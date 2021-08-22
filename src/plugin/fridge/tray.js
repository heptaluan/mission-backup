/**
 * Created by 9I
 * @Date 2021/3/22
 * @description
 */
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { Color } from 'three'
import { COL_ARRAY } from './data'
class Tray {
  constructor (option) {
    // 试剂唯一标识id, 对应条码信息
    this.trayId = option.trayId
    // 所在试剂盒id
    this.tubeBoxId = option.tubeBoxId
    // 所在冰箱Id
    this.fId = option.fridageId
    // 名称
    // 试剂位置信息
    this.positionX = option.positionX || 0
    this.positionY = option.positionY || 0
    this.positionZ = option.positionZ || 0
    // 试剂盒长宽高信息
    this.length = option.length
    this.width = option.width
    this.height = option.height
    // 试管Mesh对象存储
    this.children = []
    // 选中试管
    this.selectTube = undefined
    // 初始base
    this.baseY = undefined
  }
  // 初始化材质
  initMaterial () {
    // // 加载托盘盒模型
    // const gltfLoader = new GLTFLoader()
    // gltfLoader.load('/static/model/tray.glb', (gltf) => {
    //   const _scene = gltf.scene
    //   // const _color = new Color(1, 1, 1)
    //   // const baseColor = new Color('#2a2a2a')
    //   // _scene.children.forEach((o) => {
    //   //   if (o.type === 'Mesh') {
    //   //     o.castShadow = true
    //   //     o.receiveShadow = true
    //   //     if (o.material.color.getHexString() === _color.getHexString())  o.material.color = baseColor
    //   //     o.material.emissive = o.material.color
    //   //     o.material.emissiveMap = o.material.map
    //   //   }
    //   // })
    //   _scene.scale.set(100, 100, 100)
    //   _scene.position.set(this.positionX, this.positionY, this.positionZ)
    //   this.trayModel = _scene
    // }, undefined, (error) => {
    //   console.log(error)
    // })
  }
  // 试剂渲染函数
  render (scene) {
    // 加载托盘盒模型
    const fbxLoader = new FBXLoader()
    // const blue = new Color('#2798ff')
    // const red = new Color('#13ff3c')
    // const yellow = new Color('rgba(255,222,13,0.65)')
    // const color = [blue, red, yellow]
    fbxLoader.load('/static/model/tray.fbx', (object) => {
      object.children.forEach((child) => {
        if (child.type === 'Mesh' && child.name.indexOf('Sphere-') > -1) {
          // child.castShadow = true
          // child.receiveShadow = true
          // let random = Math.floor(Math.random() * 100) % 4
          // child.material = child.material.clone()
          // if (random !== 3 ) child.material.color = color[random]
          // child.material.emissive = child.material.color
          // child.material.emissiveMap = child.material.map
          this.children.push(child)
        }
      })
      object.position.set(this.positionX, this.positionY + 5, this.positionZ)
      scene.add(object)
      // this.renderTubeBox(scene)
    }, undefined, (error) => {
      console.log(error)
    })
  }
  renderTubeBox () {
    // todu
  }
  findTube (col, row) {
    const _col = parseInt(col) - 1
    let position = COL_ARRAY[_col] + row
    let name = 'Sphere-' + position
    const tube = this.children.find((child) => {
      return child.name === name
    })
    if (tube) {
      if (!this.baseY) this.baseY = tube.position.y
      tube.position.y = this.baseY + 2
      if (this.selectTube) this.selectTube.position.y = this.baseY
      this.selectTube = tube
      return tube
    }
  }
}
export default Tray
