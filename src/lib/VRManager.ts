import { WebGLRenderer, PerspectiveCamera, Vector3, Group, Scene as ThreeScene } from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { VRControls } from './VRControls'

/**
 * Gère la VR pour le portfolio
 */
export class VRManager {
  private vrButton?: HTMLElement
  private vrControls?: VRControls
  private cameraRig: Group
  private playerHeight = 1.7 // Hauteur des yeux

  constructor(
    private renderer: WebGLRenderer,
    private camera: PerspectiveCamera,
    private scene: ThreeScene
  ) {
    this.cameraRig = new Group()
    this.cameraRig.name = 'CameraRig'
    this.cameraRig.add(this.camera)
    this.scene.add(this.cameraRig)

    this.camera.position.set(0, 0, 0)
  }

  enable() {
    this.renderer.xr.enabled = true

    this.vrButton = VRButton.createButton(this.renderer)
    document.body.appendChild(this.vrButton)

    // Style du bouton
    this.vrButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      font-family: 'Arial', sans-serif;
      font-size: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      z-index: 999;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s;
    `

    this.vrControls = new VRControls(this.scene, this.renderer)

    this.renderer.xr.addEventListener('sessionstart', () => {
      console.log('🥽 VR Mode activé')
      if (this.vrControls) {
        this.vrControls.setupVRControllers(this.renderer.xr)
      }
      this.cameraRig.position.y = this.playerHeight
    })

    this.renderer.xr.addEventListener('sessionend', () => {
      console.log('👋 VR Mode désactivé')
      this.camera.position.set(0, 0, 0)
      this.cameraRig.position.y = this.playerHeight
    })
  }

  /**
   * Déplace le joueur avec physique (géré dans Scene)
   */
  getMovementVector(): Vector3 {
    return this.vrControls?.getMovementVector() || new Vector3()
  }

  /**
   * Rotation de la caméra (Desktop uniquement)
   */
  getCameraRotation(): { x: number, y: number } {
    return this.vrControls?.getCameraRotation() || { x: 0, y: 0 }
  }

  /**
   * Position du joueur
   */
  getPlayerPosition(): Vector3 {
    return this.cameraRig.position.clone()
  }

  setPlayerPosition(pos: Vector3) {
    this.cameraRig.position.copy(pos)
  }

  /**
   * Applique la rotation de la caméra (Desktop)
   */
  applyCameraRotation() {
    if (!this.isVRActive() && this.vrControls) {
      const rot = this.vrControls.getCameraRotation()
      this.camera.rotation.set(rot.x, rot.y, 0, 'YXZ')
    }
  }

  getJumpAction(): boolean {
    return this.vrControls?.getJumpAction() || false
  }

  isVRActive(): boolean {
    return this.renderer.xr.isPresenting
  }

  update() {
    this.vrControls?.update()
    this.applyCameraRotation()
  }

  dispose() {
    if (this.vrButton?.parentElement) {
      this.vrButton.parentElement.removeChild(this.vrButton)
    }
    this.vrControls?.dispose()
  }
}