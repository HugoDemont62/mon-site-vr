import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { Box, Plane, Text } from '@react-three/drei'
import Navigation from './Navigation'
import VRController from './VRController'

function VRScene() {
  const { isPresenting } = useXR()
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <>
      {/* Éclairage optimisé */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Sol */}
      <Plane
        args={[20, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <meshLambertMaterial color="#2a2a2a" />
      </Plane>

      {/* Objets interactifs */}
      <group ref={groupRef}>
        <Box position={[-2, 2, -5]} castShadow>
          <meshStandardMaterial color="#e53e3e" />
        </Box>

        <Box position={[2, 2, -5]} castShadow>
          <meshStandardMaterial color="#38b2ac" />
        </Box>

        <Box position={[0, 3, -7]} args={[1.5, 1.5, 1.5]} castShadow>
          <meshStandardMaterial color="#ecc94b" />
        </Box>

        <Text
          position={[0, 4, -6]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Bienvenue en VR!
        </Text>
      </group>

      <Navigation />
      <VRController />
    </>
  )
}

export default VRScene