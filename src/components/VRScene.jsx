import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useXR, useController } from '@react-three/xr'
import { OrbitControls, Box, Plane, Text } from '@react-three/drei'
import Navigation from './Navigation'
import VRController from './VRController'

function VRScene() {
  const { isPresenting } = useXR()
  const groupRef = useRef()

  // Animation continue de la scène
  useFrame((state) => {
    if (groupRef.current) {
      // Rotation lente de certains éléments
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <>
      {/* Éclairage de la scène */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight
        position={[5, 5, 5]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Sol de l'environnement VR */}
      <Plane
        args={[20, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <meshLambertMaterial color="#4a5568" />
      </Plane>

      {/* Groupe d'objets interactifs */}
      <group ref={groupRef}>
        {/* Cubes colorés flottants */}
        <Box
          position={[-2, 2, -5]}
          args={[1, 1, 1]}
          castShadow
        >
          <meshStandardMaterial color="#ff6b6b" />
        </Box>

        <Box
          position={[2, 2, -5]}
          args={[1, 1, 1]}
          castShadow
        >
          <meshStandardMaterial color="#4ecdc4" />
        </Box>

        <Box
          position={[0, 3, -7]}
          args={[1.5, 1.5, 1.5]}
          castShadow
        >
          <meshStandardMaterial color="#ffe66d" />
        </Box>

        {/* Texte 3D flottant */}
        <Text
          position={[0, 4, -6]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Bienvenue en VR!
        </Text>
      </group>

      {/* Contrôles de caméra (mode desktop uniquement) */}
      {!isPresenting && <OrbitControls enablePan={true} enableZoom={true} />}

      {/* Navigation VR */}
      <Navigation />

      {/* Contrôleurs VR */}
      <VRController />
    </>
  )
}

export default VRScene