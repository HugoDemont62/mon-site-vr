import { useEffect, useState } from 'react'

interface VRInstructionsProps {
  isVRActive: boolean
}

/**
 * Affiche les instructions adaptées au mode (VR ou Desktop)
 */
export function VRInstructions({ isVRActive }: VRInstructionsProps) {
  const [showInstructions, setShowInstructions] = useState(true)

  // Cache les instructions après 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false)
    }, 10000)

    return () => clearTimeout(timer)
  }, [isVRActive])

  if (!showInstructions) return null

  return (
    <div
      style={{
    position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.85)',
      padding: '20px 30px',
      borderRadius: '12px',
      border: '2px solid #00ff00',
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '0.6rem',
      color: '#00ff00',
      textAlign: 'center',
      zIndex: 100,
      maxWidth: '90%',
      boxShadow: '0 0 30px rgba(0, 255, 0, 0.5)',
      animation: 'fadeIn 0.5s'
  }}
>
  {isVRActive ? (
    <>
      <div style={{ marginBottom: '10px', fontSize: '0.8rem', color: '#ffff00' }}>
  🥽 MODE VR ACTIF
  </div>
  <div style={{ lineHeight: '1.8' }}>
    <div>👍 Joystick Gauche : Se déplacer</div>
  <div>🔫 Trigger Droit : Tirer</div>
  <div>🎯 Visez avec votre tête</div>
  </div>
  </>
  ) : (
    <>
      <div style={{ marginBottom: '10px', fontSize: '0.8rem', color: '#00ffff' }}>
  🖥️ MODE DESKTOP
  </div>
  <div style={{ lineHeight: '1.8' }}>
    <div>ZQSD / ← ↑ → ↓ : Se déplacer</div>
  <div>E / Entrée : Tirer</div>
  <div>Espace : Accélérer</div>
  <div>Shift : Freiner</div>
  </div>
  <div style={{ marginTop: '15px', fontSize: '0.5rem', color: '#888' }}>
    Appuyez sur le bouton en bas pour entrer en VR
  </div>
  </>
  )}

  <button
    onClick={() => setShowInstructions(false)}
  style={{
    marginTop: '15px',
      padding: '8px 16px',
      background: '#333',
      border: '1px solid #00ff00',
      color: '#00ff00',
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '0.5rem',
      cursor: 'pointer'
  }}
>
  OK
  </button>

  <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
  </div>
)
}