import { useRef } from 'react'
import './Controls.css'

function Controls({
  backgroundColor,
  onBackgroundColorChange,
  hideTitle = false
}) {
  const colorInputRef = useRef(null)

  const presetColors = [
    '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0',
    '#000000', '#1e293b', '#334155', '#475569',
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
    '#8b5cf6'
  ]

  const handleCustomColorClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (colorInputRef.current) {
      // 모바일 호환성을 위해 직접 클릭 이벤트 트리거
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
      colorInputRef.current.dispatchEvent(event)
    }
  }

  const handleColorInputChange = (e) => {
    onBackgroundColorChange(e.target.value)
  }

  return (
    <div className="controls">
      {!hideTitle && <h2 className="section-title">배경색</h2>}

      <div className="color-picker-container">
        <input
          type="text"
          value={backgroundColor}
          onChange={(e) => onBackgroundColorChange(e.target.value)}
          className="color-text-input"
          placeholder="#ffffff"
          maxLength={7}
        />
      </div>

      {/* Hidden color picker input */}
      <input
        ref={colorInputRef}
        type="color"
        value={backgroundColor}
        onChange={handleColorInputChange}
        className="hidden-color-input"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'auto',
          width: '1px',
          height: '1px',
          border: 'none'
        }}
      />

      <div className="preset-colors">
        {presetColors.map(color => (
          <button
            key={color}
            className={`preset-color ${backgroundColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onBackgroundColorChange(color)}
            aria-label={`배경색 ${color}`}
          />
        ))}
        <button
          type="button"
          className="preset-color custom-color-picker"
          onClick={handleCustomColorClick}
          aria-label="커스텀 색상 선택"
        >
          <div
            className="color-wheel"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `conic-gradient(
                from 0deg,
                #ff0000 0deg,
                #ffff00 60deg,
                #00ff00 120deg,
                #00ffff 180deg,
                #0000ff 240deg,
                #ff00ff 300deg,
                #ff0000 360deg
              )`
            }}
          />
        </button>
      </div>
    </div>
  )
}

export default Controls
