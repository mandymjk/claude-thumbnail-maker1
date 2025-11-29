import { LAYOUTS } from '../constants/layouts'
import './LayoutSelector.css'

function LayoutSelector({ selectedLayout, onSelectLayout }) {
  return (
    <div className="layout-selector">
      <div className="layout-grid">
        {LAYOUTS.map(layout => (
          <button
            key={layout.id}
            className={`layout-card ${selectedLayout === layout.id ? 'selected' : ''}`}
            onClick={() => onSelectLayout(layout.id)}
          >
            <div className="layout-preview">
              <LayoutPreview layout={layout} />
            </div>
            <span className="layout-name">{layout.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function LayoutPreview({ layout }) {
  const scale = 80 / layout.canvasWidth
  
  return (
    <svg
      width="80"
      height={layout.canvasHeight * scale}
      viewBox={`0 0 ${layout.canvasWidth} ${layout.canvasHeight}`}
      className="layout-svg"
    >
      <rect
        width={layout.canvasWidth}
        height={layout.canvasHeight}
        fill="#f1f5f9"
      />
      {layout.positions.map((pos, index) => (
        <rect
          key={index}
          x={pos.x}
          y={pos.y}
          width={pos.width}
          height={pos.height}
          fill="#cbd5e1"
          stroke="#64748b"
          strokeWidth="4"
        />
      ))}
    </svg>
  )
}

export default LayoutSelector
