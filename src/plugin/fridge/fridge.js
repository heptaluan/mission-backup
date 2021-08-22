/**
 * Created by 9I
 * @Date 2021/3/17
 * @description 冰箱对象
 */
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Color } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
class Fridge {
  constructor (option) {
    // 冰箱唯一标识id
    this.fId = option.fridgeId
    // 名称
    this.fName = option.fridgeName
    // 存储冰箱位置信息
    this.positionX = option.positionX
    this.positionY = option.positionY
    this.positionZ = option.positionZ
    // 冰箱长宽高信息
    this.length = option.length
    this.width = option.width
    this.height = option.height
    this.children = []
    this.baseZ = undefined
    // 选中试管抽屉
    this.selectTray = undefined
  }
  // 冰箱渲染函数
  // render (scene) {
  //   const gltfLoader = new GLTFLoader()
  //   gltfLoader.load('/static/model/fridge.glb', (gltf) => {
  //     // scene.add(new THREE.HemisphereLight(0xbbbbff, 0x444422, 1.5))
  //     // // 光源light
  //     // const light = new THREE.PointLight(0xfffffff)
  //     // light.position.set(500, 300, -200)
  //     //
  //     // // 告诉平行光需要开启阴影投射
  //     // light.castShadow = true
  //     //
  //     // scene.add(light)
  //     const _scene = gltf.scene
  //     const _color = new Color(1, 1, 1)
  //     const baseColor = new Color('#2a2a2a')
  //     _scene.children.forEach((o) => {
  //       if (o.type === 'Mesh') {
  //         o.castShadow = true
  //         o.receiveShadow = true
  //         if (o.material.color.getHexString() === _color.getHexString())  o.material.color = baseColor
  //         o.material.emissive = o.material.color
  //         o.material.emissiveMap = o.material.map
  //       }
  //     })
  //     _scene.scale.set(100, 100, 100)
  //     _scene.position.set(this.positionX, this.positionY, this.positionZ)
  //     scene.add(_scene)
  //   }, undefined, (error) => {
  //     console.log(error)
  //   })
  // }
  render (scene) {
    // 加载托盘盒模型
    const fbxLoader = new FBXLoader()
    fbxLoader.load('/static/model/fridge.fbx', (object) => {
      const _color = new Color(1, 1, 1)
      const baseColor = new Color('#2a2a2a')
      object.children.forEach((o) => {
        if (o.type === 'Mesh') {
          o.castShadow = true
          o.receiveShadow = true
          // if (o.material.color.getHexString() === _color.getHexString())  o.material.color = baseColor
          // o.material.emissive = o.material.color
          o.material.emissiveMap = o.material.map
          this.children.push(o)
        }
      })
      object.position.set(this.positionX, this.positionY + 5, this.positionZ)
      scene.add(object)
      // this.renderTubeBox(scene)
    }, undefined, (error) => {
      console.log(error)
    })
  }

  findTray (name) {
    const tray = this.children.find((child) => {
      return child.name === name
    })
    if (tray) {
      if (!this.baseZ) this.baseZ = tray.position.z
      tray.position.z = this.baseZ + 50
      if (this.selectTray) this.selectTray.position.z = this.baseZ
      this.selectTray = tray
      return tray
    }
  }
}
export default Fridge
