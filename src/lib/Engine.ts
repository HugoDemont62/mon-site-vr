import { Clock, WebGLRenderer, Scene as ThreeScene, PerspectiveCamera } from 'three'
import type { PortfolioScene } from './PortfolioScene'
import { PostProcessing } from './PostProcessing'
import { VRManager } from './VRManager'

export class Engine {
  renderer: WebGLRenderer
  clock: Clock
  scene?: PortfolioScene
  vrManager?: VRManager
  private post?: PostProcessing

  constructor (parent?: HTMLElement) {
    this.renderer = new WebGLRenderer({ antialias: true })
    parent?.append(this.renderer.domElement)
    this.clock = new Clock()

    this.renderer.domElement.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: -1; touch-action: none;`

    // ⚠️ IMPORTANT : setAnimationLoop pour la VR
    // En VR, il faut utiliser setAnimationLoop au lieu de requestAnimationFrame
    this.renderer.setAnimationLoop(this.update.bind(this))

    globalThis.addEventListener('resize', this.resize)

    // Initialiser postprocessing (désactivé en VR pour les performances)
    this.post = new PostProcessing(this.renderer)
  }

  /**
   * Active le support VR
   * À appeler après avoir créé la scène
   */
  enableVR(camera: PerspectiveCamera, scene: ThreeScene) {
    this.vrManager = new VRManager(this.renderer, camera, scene)
    this.vrManager.enable()
    console.log('🥽 VR Manager activé')
  }

  setScene(S: new (engine: Engine) => Scene) {
    this.scene = new S(this)
    this.resize()
  }

  setPixelRatio(pixelRatio: number) {
    this.renderer.setPixelRatio(Math.min(2, pixelRatio))
  }

  update() {
    // Met à jour le VR Manager
    if (this.vrManager) {
      this.vrManager.update()
    }

    this.scene?.render()
  }

  resize = () => {
    this.renderer.setSize(globalThis.innerWidth, globalThis.innerHeight)
    // Redimensionner composer si présent
    if (this.post) this.post.setSize(globalThis.innerWidth, globalThis.innerHeight)
    this.scene?.resize()
  }

  /**
   * Méthode pour que la Scene demande le rendu
   * Utilise composer si présent ET si on n'est pas en VR
   */
  render(scene: ThreeScene, camera: PerspectiveCamera) {
    // Désactive le post-processing en VR pour les performances
    const usePost = this.post && (!this.vrManager || !this.vrManager.isVRActive())

    if (usePost) {
      this.post.render(scene, camera)
    } else {
      this.renderer.render(scene, camera)
    }
  }
}