import React from 'react'
import { Canvas } from '@react-three/fiber'
import { VRButton, XR } from '@react-three/xr'
import VRScene from './components/VRScene'
import './index.css'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className="vr-ui">
        <h3>Site VR avec React</h3>
        <p>Mode desktop : WASD + souris | Mode VR : bouton ci-dessous</p>
        <VRButton className="vr-button" />
      </div>

      <Canvas
        camera={{ position: [0, 1.6, 3], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.physicallyCorrectLights = true
        }}
      >
        <XR>
          <VRScene />
        </XR>
      </Canvas>
    </div>
  )
}

export default App