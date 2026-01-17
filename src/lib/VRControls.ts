import { Vector3, Group, WebXRManager } from 'three'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js'

/**
 * Gestion des contrôles pour se déplacer dans le portfolio
 * - Desktop : ZQSD + Souris
 * - VR : Joysticks + Rotation naturelle de la tête
 */
export class VRControls {
  private controller1?: Group
  private controller2?: Group

  // Mouvement
  private moveVector = new Vector3()
  private rotationY = 0 // Rotation horizontale (desktop uniquement)

  // Desktop controls
  private keys: Record<string, boolean> = {}
  private mouseX = 0
  private mouseY = 0
  private mouseSensitivity = 0.002

  // VR controller states
  private thumbstickLeft = { x: 0, y: 0 }
  private thumbstickRight = { x: 0, y: 0 }

  constructor(
    private scene: Group,
    private renderer: { xr?: { isPresenting?: boolean, getSession?: () => XRSession | null } }
  ) {
    this.setupDesktopControls()
  }

  private setupDesktopControls() {
    // Clavier
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true
    })

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false
    })

    // Souris pour regarder autour (FPS style)
    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement) {
        this.mouseX += e.movementX * this.mouseSensitivity
        this.mouseY += e.movementY * this.mouseSensitivity
        // Limite la rotation verticale
        this.mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.mouseY))
      }
    })

    // Click pour verrouiller la souris
    document.addEventListener('click', () => {
      if (!this.isVRActive()) {
        document.body.requestPointerLock()
      }
    })
  }

  setupVRControllers (renderer: WebXRManager) {
    const factory = new XRControllerModelFactory()

    // Contrôleur gauche (mouvement)
    this.controller1 = renderer.xr.getController(0)
    this.controller1.addEventListener('connected', (e) => {
      const data = (e as { data?: { gamepad?: Gamepad } }).data
      if (data?.gamepad) this.updateLeftThumbstick(data.gamepad)
    })
    this.scene.add(this.controller1)

    const grip1 = renderer.xr.getControllerGrip(0)
    grip1.add(factory.createControllerModel(grip1))
    this.scene.add(grip1)

    // Contrôleur droit (rotation)
    this.controller2 = renderer.xr.getController(1)
    this.controller2.addEventListener('connected', (e) => {
      const data = (e as { data?: { gamepad?: Gamepad } }).data
      if (data?.gamepad) this.updateRightThumbstick(data.gamepad)
    })
    this.scene.add(this.controller2)

    const grip2 = renderer.xr.getControllerGrip(1)
    grip2.add(factory.createControllerModel(grip2))
    this.scene.add(grip2)
  }

  private updateLeftThumbstick(gamepad: Gamepad) {
    this.thumbstickLeft.x = gamepad.axes[2] || 0
    this.thumbstickLeft.y = gamepad.axes[3] || 0
  }

  private updateRightThumbstick(gamepad: Gamepad) {
    this.thumbstickRight.x = gamepad.axes[0] || 0
    this.thumbstickRight.y = gamepad.axes[1] || 0
  }

  /**
   * Retourne le vecteur de déplacement (avant/arrière/gauche/droite)
   */
  getMovementVector(): Vector3 {
    this.moveVector.set(0, 0, 0)

    if (this.isVRActive()) {
      // VR : joystick gauche
      this.moveVector.x = this.thumbstickLeft.x
      this.moveVector.z = this.thumbstickLeft.y
    } else {
      // Desktop : ZQSD
      if (this.keys['z'] || this.keys['w'] || this.keys['arrowup']) this.moveVector.z -= 1
      if (this.keys['s'] || this.keys['arrowdown']) this.moveVector.z += 1
      if (this.keys['q'] || this.keys['a'] || this.keys['arrowleft']) this.moveVector.x -= 1
      if (this.keys['d'] || this.keys['arrowright']) this.moveVector.x += 1
    }

    if (this.moveVector.length() > 0) {
      this.moveVector.normalize()
    }

    return this.moveVector
  }

  /**
   * Retourne la rotation de la caméra (Desktop seulement, VR utilise la tête)
   */
  getCameraRotation(): { x: number, y: number } {
    return { x: this.mouseY, y: this.mouseX }
  }

  /**
   * Vérifie si on peut sauter (Espace)
   */
  getJumpAction(): boolean {
    const jump = this.keys[' '] || this.keys['space']
    if (jump) {
      this.keys[' '] = false
      this.keys['space'] = false
    }
    return jump
  }

  isVRActive(): boolean {
    return this.renderer.xr?.isPresenting || false
  }

  update() {
    if (!this.isVRActive()) return

    const session = this.renderer.xr?.getSession?.()
    if (session?.inputSources) {
      for (const source of session.inputSources) {
        if (source.gamepad) {
          if (source.handedness === 'left') {
            this.updateLeftThumbstick(source.gamepad)
          } else if (source.handedness === 'right') {
            this.updateRightThumbstick(source.gamepad)
          }
        }
      }
    }
  }

  dispose() {
    document.removeEventListener('keydown', () => {})
    document.removeEventListener('keyup', () => {})
    document.removeEventListener('mousemove', () => {})
    document.removeEventListener('click', () => {})
  }
}