import React from 'react'
import { useController } from '@react-three/xr'
import { Sphere } from '@react-three/drei'

// Représentation visuelle des contrôleurs
function ControllerModel({ hand }) {
  const controller = useController(hand)

  if (!controller) return null

  return (
    <group>
      {/* Sphère représentant la position du contrôleur */}
      <Sphere args={[0.02]} position={controller.grip?.position || [0, 0, 0]}>
        <meshBasicMaterial
          color={hand === 'left' ? '#ff6b6b' : '#4ecdc4'}
        />
      </Sphere>

      {/* Rayon pointant depuis le contrôleur */}
      <mesh position={[0, 0, -1]} scale={[0.01, 0.01, 2]}>
        <boxGeometry />
        <meshBasicMaterial
          color={hand === 'left' ? '#ff6b6b' : '#4ecdc4'}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

function VRController() {
  return (
    <>
      <ControllerModel hand="left" />
      <ControllerModel hand="right" />
    </>
  )
}

export default VRController