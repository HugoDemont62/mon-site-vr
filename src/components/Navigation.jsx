import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useXR, useController } from '@react-three/xr'
import { Vector3 } from 'three'

function Navigation() {
  const { player } = useXR()
  const leftController = useController('left')
  const velocityRef = useRef(new Vector3())

  useFrame((state, delta) => {
    if (!player) return

    const speed = 3
    const damping = 0.9
    const moveVector = new Vector3()

    // Mouvement VR avec contrôleur
    if (leftController?.inputSource?.gamepad?.axes) {
      const axes = leftController.inputSource.gamepad.axes
      if (axes.length >= 4) {
        moveVector.x = axes[2] || 0
        moveVector.z = axes[3] || 0
      }
    }

    // Mouvement desktop (fallback)
    if (moveVector.length() === 0) {
      // Simple contrôles par défaut si pas de VR
      const keyboard = {
        w: false, s: false, a: false, d: false
      }

      // Tu peux étendre ça avec les événements clavier si nécessaire
    }

    // Appliquer le mouvement si détecté
    if (moveVector.length() > 0.1) {
      const headRotation = state.camera.rotation.y

      const rotatedX = moveVector.x * Math.cos(headRotation) - moveVector.z * Math.sin(headRotation)
      const rotatedZ = moveVector.x * Math.sin(headRotation) + moveVector.z * Math.cos(headRotation)

      velocityRef.current.x += rotatedX * speed * delta
      velocityRef.current.z += rotatedZ * speed * delta
    }

    velocityRef.current.multiplyScalar(damping)

    if (velocityRef.current.length() > 0.01) {
      player.position.add(velocityRef.current)
    }
  })

  return null
}

export default Navigation