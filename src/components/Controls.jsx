import './Controls.css'

function Controls({ 
  backgroundColor, 
  onBackgroundColorChange,
  hideTitle = false
}) {
  const presetColors = [
    '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0',
    '#000000', '#1e293b', '#334155', '#475569',
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
    '#8b5cf6', '#ec4899'
  ]

  return (
    <div className="controls">
      {!hideTitle && <h2 className="section-title">배경색</h2>}
      
      <div className="color-picker-container">
        <input
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
      </div>
    </div>
  )
}

export default Controls
