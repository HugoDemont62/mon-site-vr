import React from 'react'
import { useController } from '@react-three/xr'

function ControllerModel({ hand }) {
  const controller = useController(hand)

  if (!controller) return null

  return (
    <group>
      <mesh position={[0, 0, 0]} scale={[0.05, 0.05, 0.05]}>
        <sphereGeometry />
        <meshBasicMaterial
          color={hand === 'left' ? '#e53e3e' : '#38b2ac'}
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