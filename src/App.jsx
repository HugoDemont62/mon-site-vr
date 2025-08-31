import React from 'react'
import { Canvas } from '@react-three/fiber'
import { VRButton, XR } from '@react-three/xr'
import VRScene from './components/VRScene'
import './index.css'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Interface utilisateur */}
      <div className="vr-ui">
        <h3>Site VR avec React</h3>
        <p>Appuyez sur "Enter VR" pour commencer l'expérience</p>
        {/* Bouton pour entrer en mode VR */}
        <VRButton className="vr-button" />
      </div>

      {/* Canvas 3D avec support VR */}
      <Canvas
        camera={{ position: [0, 1.6, 3], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* XR englobe tout le contenu VR */}
        <XR>
          <VRScene />
        </XR>
      </Canvas>
    </div>
  )
}

export default App