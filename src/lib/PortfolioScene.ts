import {
  Scene as ThreeScene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  PointLight,
  Mesh,
  BoxGeometry,
  MeshStandardMaterial,
  PlaneGeometry,
  Vector3,
  Color,
  TextureLoader,
  RepeatWrapping
} from 'three'
import { World, RigidBody, RigidBodyDesc, ColliderDesc } from '@dimforge/rapier3d'
import { Engine } from './Engine'

/**
 * Scène du portfolio : une pièce où on peut se déplacer
 */
export class PortfolioScene extends ThreeScene {
  engine: Engine
  camera: PerspectiveCamera
  world: World

  // Physique du joueur
  private playerBody: RigidBody
  private playerVelocity = new Vector3()
  private onGround = false
  private playerSpeed = 5
  private jumpForce = 6
  private gravity = -15

  constructor(engine: Engine) {
    super()
    this.engine = engine

    // Fond bleu clair
    this.background = new Color(0x87CEEB)

    // Caméra
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.set(0, 1.7, 0)

    // Physique Rapier
    this.world = new World({ x: 0, y: -9.81, z: 0 })

    // Créer le corps physique du joueur (capsule invisible)
    const playerBodyDesc = RigidBodyDesc.dynamic()
    this.playerBody = this.world.createRigidBody(playerBodyDesc)
    this.playerBody.setTranslation({ x: 0, y: 1.7, z: 5 }, true)

    // Collider cylindrique pour le joueur (0.4 rayon, 1.7 hauteur)
    const playerCollider = ColliderDesc.cylinder(0.85, 0.4)
    this.world.createCollider(playerCollider, this.playerBody)

    // Construire la scène
    this.setupLights()
    this.createRoom()
    this.createFurniture()

    // Activer VR
    this.engine.enableVR(this.camera, this)

    console.log('✅ Portfolio Scene initialisée')
  }

  private setupLights() {
    // Lumière ambiante
    const ambient = new AmbientLight(0xffffff, 0.6)
    this.add(ambient)

    // Lumière directionnelle (soleil)
    const sun = new DirectionalLight(0xffffff, 0.8)
    sun.position.set(5, 10, 5)
    sun.castShadow = true
    sun.shadow.camera.near = 0.1
    sun.shadow.camera.far = 50
    sun.shadow.camera.left = -10
    sun.shadow.camera.right = 10
    sun.shadow.camera.top = 10
    sun.shadow.camera.bottom = -10
    sun.shadow.mapSize.width = 2048
    sun.shadow.mapSize.height = 2048
    this.add(sun)

    // Lumières ponctuelles (ambiance)
    const light1 = new PointLight(0xff9966, 1, 10)
    light1.position.set(-4, 2, -4)
    this.add(light1)

    const light2 = new PointLight(0x6699ff, 1, 10)
    light2.position.set(4, 2, 4)
    this.add(light2)
  }

  /**
   * Crée la pièce (murs, sol, plafond)
   */
  private createRoom() {
    const roomSize = { width: 10, height: 4, depth: 10 }

    // Sol
    const floor = new Mesh(
      new PlaneGeometry(roomSize.width, roomSize.depth),
      new MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.8,
        metalness: 0.2
      })
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = 0
    floor.receiveShadow = true
    this.add(floor)

    // Collider sol
    const floorBody = this.world.createRigidBody(RigidBodyDesc.fixed())
    const floorCollider = ColliderDesc.cuboid(roomSize.width / 2, 0.1, roomSize.depth / 2)
    this.world.createCollider(floorCollider, floorBody)
    floorBody.setTranslation({ x: 0, y: 0, z: 0 }, true)

    // Murs
    this.createWall(0, roomSize.height / 2, -roomSize.depth / 2, roomSize.width, roomSize.height, 0.2) // Mur arrière
    this.createWall(0, roomSize.height / 2, roomSize.depth / 2, roomSize.width, roomSize.height, 0.2) // Mur avant
    this.createWall(-roomSize.width / 2, roomSize.height / 2, 0, 0.2, roomSize.height, roomSize.depth) // Mur gauche
    this.createWall(roomSize.width / 2, roomSize.height / 2, 0, 0.2, roomSize.height, roomSize.depth) // Mur droit

    // Plafond
    const ceiling = new Mesh(
      new PlaneGeometry(roomSize.width, roomSize.depth),
      new MeshStandardMaterial({ color: 0xffffff })
    )
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.y = roomSize.height
    this.add(ceiling)
  }

  private createWall(x: number, y: number, z: number, width: number, height: number, depth: number) {
    // Mesh visuel
    const wall = new Mesh(
      new BoxGeometry(width, height, depth),
      new MeshStandardMaterial({ color: 0xcccccc })
    )
    wall.position.set(x, y, z)
    wall.castShadow = true
    wall.receiveShadow = true
    this.add(wall)

    // Collider
    const body = this.world.createRigidBody(RigidBodyDesc.fixed())
    const collider = ColliderDesc.cuboid(width / 2, height / 2, depth / 2)
    this.world.createCollider(collider, body)
    body.setTranslation({ x, y, z }, true)
  }

  /**
   * Ajoute du mobilier (exemples de projets)
   */
  private createFurniture() {
    // Table (exemple : projet 1)
    this.createBox(0, 0.5, 0, 2, 1, 1, 0x8B4513, 'Table - Projet 1')

    // Cubes sur la table (projets interactifs)
    this.createBox(-0.5, 1.3, 0, 0.3, 0.3, 0.3, 0xff6b6b, 'Projet A')
    this.createBox(0, 1.3, 0, 0.3, 0.3, 0.3, 0x4ecdc4, 'Projet B')
    this.createBox(0.5, 1.3, 0, 0.3, 0.3, 0.3, 0xffe66d, 'Projet C')

    // Panneau mural (CV/About)
    const panel = new Mesh(
      new BoxGeometry(3, 2, 0.1),
      new MeshStandardMaterial({ color: 0x2c3e50 })
    )
    panel.position.set(0, 2, -4.9)
    this.add(panel)
  }

  private createBox(x: number, y: number, z: number, w: number, h: number, d: number, color: number, name?: string) {
    const box = new Mesh(
      new BoxGeometry(w, h, d),
      new MeshStandardMaterial({ color })
    )
    box.position.set(x, y, z)
    box.castShadow = true
    box.receiveShadow = true
    if (name) box.name = name
    this.add(box)

    // Physique
    const body = this.world.createRigidBody(RigidBodyDesc.fixed())
    const collider = ColliderDesc.cuboid(w / 2, h / 2, d / 2)
    this.world.createCollider(collider, body)
    body.setTranslation({ x, y, z }, true)
  }

  /**
   * Boucle de rendu
   */
  render() {
    const delta = this.engine.clock.getDelta()

    // Mise à jour physique
    this.world.step()

    // Mise à jour VR
    this.engine.vrManager?.update()

    // Contrôles et mouvement
    this.updatePlayer(delta)

    // Rendu
    this.engine.render(this, this.camera)
  }

  private updatePlayer(delta: number) {
    const vrManager = this.engine.vrManager
    if (!vrManager) return

    const input = vrManager.getMovementVector()

    // Calcul du mouvement
    const forward = new Vector3(0, 0, -1)
    const right = new Vector3(1, 0, 0)

    if (!vrManager.isVRActive()) {
      // Desktop : utilise la rotation de la caméra
      forward.applyQuaternion(this.camera.quaternion)
      right.applyQuaternion(this.camera.quaternion)
    } else {
      // VR : utilise la direction du corps (pas de la tête)
      const camRig = this.children.find(c => c.name === 'CameraRig')
      if (camRig) {
        forward.applyQuaternion(camRig.quaternion)
        right.applyQuaternion(camRig.quaternion)
      }
    }

    forward.y = 0
    right.y = 0
    forward.normalize()
    right.normalize()

    // Vélocité horizontale
    const moveDir = new Vector3()
    moveDir.addScaledVector(forward, -input.z)
    moveDir.addScaledVector(right, input.x)

    if (moveDir.length() > 0) {
      moveDir.normalize()
      this.playerVelocity.x = moveDir.x * this.playerSpeed
      this.playerVelocity.z = moveDir.z * this.playerSpeed
    } else {
      this.playerVelocity.x *= 0.8 // Friction
      this.playerVelocity.z *= 0.8
    }

    // Gravité et saut
    this.playerVelocity.y += this.gravity * delta

    // Détection du sol (simple : y <= 1.7)
    const pos = this.playerBody.translation()
    this.onGround = pos.y <= 1.71

    if (this.onGround && this.playerVelocity.y < 0) {
      this.playerVelocity.y = 0
      this.playerBody.setTranslation({ x: pos.x, y: 1.7, z: pos.z }, true)
    }

    // Saut
    if (vrManager.getJumpAction() && this.onGround) {
      this.playerVelocity.y = this.jumpForce
    }

    // Applique la vélocité
    const newPos = {
      x: pos.x + this.playerVelocity.x * delta,
      y: pos.y + this.playerVelocity.y * delta,
      z: pos.z + this.playerVelocity.z * delta
    }

    this.playerBody.setTranslation(newPos, true)

    // Synchronise la position VR
    vrManager.setPlayerPosition(new Vector3(newPos.x, newPos.y, newPos.z))
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  dispose() {
    // Nettoie tout
    this.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose()
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose())
        } else {
          obj.material.dispose()
        }
      }
    })
  }
}