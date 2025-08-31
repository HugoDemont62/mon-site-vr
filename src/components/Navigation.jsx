import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useXR, useController } from '@react-three/xr'
import * as THREE from 'three'

function Navigation() {
  const { player } = useXR()
  const leftController = useController('left')
  const rightController = useController('right')
  const velocityRef = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    if (!player) return

    // Variables de mouvement
    const speed = 3 // Vitesse de déplacement
    const damping = 0.9 // Ralentissement progressif

    // Direction du mouvement basée sur les contrôleurs VR
    const moveVector = new THREE.Vector3()

    // Mouvement avec le contrôleur gauche (joystick)
    if (leftController?.inputSource?.gamepad) {
      const gamepad = leftController.inputSource.gamepad
      const axes = gamepad.axes

      if (axes.length >= 2) {
        // Axes du joystick (x, y)
        moveVector.x = axes[2] || 0 // Joystick horizontal
        moveVector.z = axes[3] || 0 // Joystick vertical
      }
    }

    // Appliquer le mouvement
    if (moveVector.length() > 0.1) { // Seuil pour éviter la dérive
      // Orienter le mouvement selon la direction de la tête
      const headRotation = new THREE.Euler()
      if (state.camera.rotation) {
        headRotation.copy(state.camera.rotation)
        headRotation.x = 0 // On garde seulement la rotation Y (horizontale)
        headRotation.z = 0
      }

      // Appliquer la rotation à la direction
      moveVector.applyEuler(headRotation)
      moveVector.y = 0 // Pas de mouvement vertical
      moveVector.normalize()
      moveVector.multiplyScalar(speed * delta)

      // Mettre à jour la vélocité
      velocityRef.current.add(moveVector)
    }

    // Appliquer le ralentissement
    velocityRef.current.multiplyScalar(damping)

    // Déplacer le joueur
    if (velocityRef.current.length() > 0.01) {
      player.position.add(velocityRef.current)
    }
  })

  return null // Ce composant ne rend rien visuellement
}

export default Navigation