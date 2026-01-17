import { useEffect, useState } from 'react'
import { Engine } from './lib/Engine'
import { PortfolioScene } from './lib/PortfolioScene'
import './App.css'

function App() {
  const [engine] = useState(() => new Engine(document.body))
  const [scene] = useState(() => new PortfolioScene(engine))
  const [isVRActive, setIsVRActive] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    // Assigne la scène à l'engine
    engine.scene = scene
    engine.resize()

    // Surveille le mode VR
    const checkVR = setInterval(() => {
      setIsVRActive(engine.vrManager?.isVRActive() || false)
    }, 500)

    // Cache les instructions après 8 secondes
    const timer = setTimeout(() => {
      setShowInstructions(false)
    }, 8000)

    return () => {
      clearInterval(checkVR)
      clearTimeout(timer)
      scene.dispose()
    }
  }, [engine, scene])

  return (
    <>
      {/* Instructions de contrôle */}
      {showInstructions && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '30px 40px',
          borderRadius: '16px',
          border: '2px solid #667eea',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          zIndex: 100,
          maxWidth: '90%',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)'
        }}>
          <h2 style={{
            marginBottom: '20px',
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {isVRActive ? '🥽 Mode VR' : '🖥️ Mode Desktop'}
          </h2>

          {isVRActive ? (
            <div style={{ lineHeight: '2' }}>
              <p>👍 <strong>Joystick Gauche</strong> : Se déplacer</p>
              <p>🎯 <strong>Votre tête</strong> : Regarder autour</p>
              <p>⬆️ <strong>Bouton A</strong> : Sauter</p>
            </div>
          ) : (
            <div style={{ lineHeight: '2' }}>
              <p>🖱️ <strong>Cliquez</strong> pour verrouiller la souris</p>
              <p>⌨️ <strong>ZQSD</strong> : Se déplacer</p>
              <p>🖱️ <strong>Souris</strong> : Regarder autour</p>
              <p>⬆️ <strong>Espace</strong> : Sauter</p>
            </div>
          )}

          <button
            onClick={() => setShowInstructions(false)}
            style={{
              marginTop: '20px',
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Compris !
          </button>
        </div>
      )}

      {/* Indicateur mode VR/Desktop */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '10px 20px',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '0.9rem',
        zIndex: 10
      }}>
        {isVRActive ? '🥽 VR Actif' : '🖥️ Desktop'}
      </div>

      {/* Instructions rapides */}
      <div style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '8px 16px',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '0.8rem',
        zIndex: 10,
        textAlign: 'center'
      }}>
        {isVRActive ? (
          'Joystick pour bouger'
        ) : (
          'ZQSD pour bouger • Espace pour sauter'
        )}
      </div>

      {/* Info portfolio */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '0.9rem',
        zIndex: 10,
        maxWidth: '250px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>Portfolio 3D</h3>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>
          Explorez mes projets en vous déplaçant dans cet espace virtuel
        </p>
      </div>
    </>
  )
}

export default App