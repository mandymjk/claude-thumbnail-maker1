import './Controls.css'

const isValidHexColor = (color) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)

function Controls({ 
  backgroundColor, 
  onBackgroundColorChange,
  hideTitle = false
}) {
  const presetColors = [
    '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0',
    '#000000', '#1e293b', '#475569',
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
    '#8b5cf6', '#ec4899'
  ]

  const handleColorInputChange = (value) => {
    const sanitized = value.trim()
    
    if (sanitized === '') {
      return
    }
    
    if (!sanitized.startsWith('#')) {
      return
    }
    
    if (sanitized.length <= 7) {
      if (sanitized.length === 7 || sanitized.length === 4) {
        if (isValidHexColor(sanitized)) {
          onBackgroundColorChange(sanitized)
        }
      } else {
        onBackgroundColorChange(sanitized)
      }
    }
  }

  return (
    <div className="controls">
      {!hideTitle && <h2 className="section-title">배경색</h2>}
      
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
        
        {/* 커스텀 색상 선택 버튼 - 14번째 자리 */}
        <label className="preset-color custom-color-picker" aria-label="커스텀 색상 선택">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => onBackgroundColorChange(e.target.value)}
            className="color-picker-input"
          />
        </label>
      </div>

      <div className="color-input-row">
        <span className="color-label">현재 색상:</span>
        <input
          type="text"
          value={backgroundColor}
          onChange={(e) => handleColorInputChange(e.target.value)}
          className="color-text-input"
          placeholder="#ffffff"
          maxLength={7}
        />
      </div>
    </div>
  )
}

export default Controls
