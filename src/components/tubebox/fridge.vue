<template>
  <div ref="model-fridge"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Fridge  from 'src/plugin/fridge'
import { RenderPass, EffectComposer, OutlinePass } from 'three-outlinepass'
export default {
  name: 'model-fridge',
  data () {
    return {
      camera: undefined,
      scene: undefined,
      renderer: undefined,
      controls: undefined,
      light: undefined,
      matArrayA: [],
      matArrayB: [],
      composer: null,
      outlinePass: null,
      renderPass: null,
      clock: undefined,
      searchText: '',
      orderList: [],
      fridge: undefined
    }
  },
  props: {
    width: {
      required: true,
      default: () => {
        return window.innerWidth
      }
    },
    height: {
      required: true,
      default: () => {
        return window.innerHeight
      }
    }
  },
  mounted () {
    this.clock = new THREE.Clock()
    this.init()
    this.animate()
  },
  methods: {
    //#region
    // 初始化场景
    initScene () {
      this.scene = new THREE.Scene()
      this.scene.fog = new THREE.Fog(this.scene.background, 3000, 5000)
    },

    // 初始化相机
    initCamera () {
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000)
      this.camera.position.set(0, 150, 600)
      this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    },

    // 初始化灯光
    initLight () {
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)//模拟远处类似太阳的光源
      directionalLight.color.setHSL(0.1, 1, 0.95)
      directionalLight.position.set(0, 200, 0).normalize()
      this.scene.add(directionalLight)

      const ambient = new THREE.AmbientLight(0xffffff, 1) //AmbientLight,影响整个场景的光源
      ambient.position.set(0, 0, 0)
      this.scene.add(ambient)
    },

    // 初始化渲染器
    initRenderer () {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      })
      this.renderer.setSize(this.width, this.height)
      this.renderer.setClearColor(0x222222, 1.0)
      this.renderer.shadowMap.enabled = true
      this.$refs['model-fridge'].appendChild(this.renderer.domElement)
    },

    //创建地板
    createFloor () {
      const loader = new THREE.TextureLoader()
      const _this = this
      loader.load('/static/model/floor.jpg', function(texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(10, 10)
        const floorGeometry = new THREE.BoxGeometry(2600, 1400, 1)
        const floorMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        const floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.position.y = -0.5
        floor.rotation.x = Math.PI / 2
        floor.name = '地面'
        _this.scene.add(floor)
      })
    },

    // 初始化模型
    initContent () {
      this.createFloor()
    },

    // 初始化轨迹球控件
    initControls () {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.5
      // 视角最小距离
      this.controls.minDistance = 10
      // 视角最远距离
      this.controls.maxDistance = 1000
      // 最大角度
      this.controls.maxPolarAngle = Math.PI / 2.2
    },

    // 更新控件
    update (delta) {
      // this.stats.update(delta)
      this.controls.update(delta)
    },
    // 渲染
    animate () {
      const delta = this.clock.getDelta()
      requestAnimationFrame(this.animate)
      if (this.renderer) this.renderer.render(this.scene, this.camera)
      if (this.composer) {
        this.composer.render(delta)
      }
      this.update(delta)
    },
    //#endregion
    // 初始化
    init () {
      this.initScene()
      this.initCamera()
      this.initRenderer()
      this.initContent()
      this.initLight()
      this.initControls()
      this.fridge = new Fridge(this.scene)
      document.addEventListener('resize', this.onWindowResize, false)
    },

    // 窗口变动触发的方法
    onWindowResize () {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.width = 600
      this.height = (window.innerHeight - 190) / 2
      this.renderer.setSize(this.width, this.height)
    },

    // 鼠标双击触发的方法
    onMouseDblclick (event) {
      // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
      const intersects = this.getIntersects(event)
      // 获取选中最近的 Mesh 对象
      if (intersects.length != 0 && intersects[0].object instanceof THREE.Mesh) {
        const selectObject = intersects[0].object
        this.highlightObject(selectObject)
      } else {
        console.log('未选中 Mesh!')
      }
    },
    // 获取与射线相交的对象数组
    getIntersects (event) {
      event.preventDefault()

      // 声明 raycaster 和 mouse 变量
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()
      const scene = this.scene
      const camera = this.camera

      // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
      raycaster.setFromCamera(mouse, camera)

      // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
      const intersects = raycaster.intersectObjects(scene.children)

      //返回选中的对象
      return intersects
    },
    //高亮显示模型（呼吸灯）
    highlightObject (selectedObjects) {
      const { scene, camera, renderer } = this
      // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
      // this.composer = new EffectComposer(this.renderer)
      // // 新建一个场景通道  为了覆盖到原理来的场景上
      // this.renderPass = new RenderPass(this.scene, this.camera)
      // // 物体边缘发光通道
      // this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera, selectedObjects)
      // this.outlinePass.selectedObjects = selectedObjects
      this.composer = new EffectComposer(renderer)
      const renderPass = new RenderPass(scene, camera)
      const outlinePass = new OutlinePass(new THREE.Vector2(this.width, this.height), scene, camera, selectedObjects)
      outlinePass.renderToScreen = true
      outlinePass.selectedObjects = selectedObjects
      const params = {
        edgeStrength: 2,
        edgeGlow: 1,
        edgeThickness: 1.0,
        pulsePeriod: 0,
        usePatternTexture: false
      }
      outlinePass.edgeStrength = params.edgeStrength
      outlinePass.edgeGlow = params.edgeGlow
      outlinePass.visibleEdgeColor.set(0xff0000)
      outlinePass.hiddenEdgeColor.set(0xff0000)
      // this.outlinePass.clear = true
      this.composer.addPass(renderPass)
      this.composer.addPass(outlinePass)
      this.composer.render(scene, camera)
      // 自定义的着色器通道 作为参数
      // const effectFXAA = new ShaderPass(FXAAShader)
      // effectFXAA.uniforms.resolution.value.set(1 / window.innerWidth, 1 / window.innerHeight)
      // effectFXAA.renderToScreen = true
      // this.composer.addPass(effectFXAA)
    },
    // find fridge
    findFirdge(record) {
      let _fridge = this.fridge.fridgeStore[1]
      const { floor, grid, drawer } = record
      const name = this.fridge.getMeshNameByPosition(floor, grid, drawer)
      const object = _fridge.findTray(name)
      if (object) this.highlightObject([object])
    }
  },
  beforeDestroy () {
    if (this.renderer) {
      this.renderer.forceContextLoss()
      this.renderer = undefined
    }
    this.animate = () => {}
  }
}
</script>
