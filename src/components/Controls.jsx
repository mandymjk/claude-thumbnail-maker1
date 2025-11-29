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
    '#8b5cf6', '#ec4899'
  ]

  const handleCustomColorClick = () => {
    colorInputRef.current?.click()
  }

  return (
    <div className="controls">
      {!hideTitle && <h2 className="section-title">배경색</h2>}

      <div className="color-picker-container">
        <input
          ref={colorInputRef}
          type="color"
          value={backgroundColor}
          onChange={(e) => onBackgroundColorChange(e.target.value)}
          className="color-input"
        />
        <input
          type="text"
          value={backgroundColor}
          onChange={(e) => onBackgroundColorChange(e.target.value)}
          className="color-text-input"
          placeholder="#ffffff"
        />
      </div>

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
          className="preset-color custom-color-picker"
          onClick={handleCustomColorClick}
          aria-label="커스텀 색상 선택"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id="colorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="75%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="9" fill="url(#colorGradient)" opacity="0.9" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" opacity="0.3" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Controls
