import { useEffect, useRef, forwardRef, useState } from 'react'
import './Canvas.css'

const Canvas = forwardRef(({ 
  layout, 
  images, 
  backgroundColor, 
  imagePositions,
  onUpdatePosition 
}, ref) => {
  const containerRef = useRef(null)
  const [dragState, setDragState] = useState(null)
  const [loadedImages, setLoadedImages] = useState({})

  // 이미지 로드
  useEffect(() => {
    const newLoadedImages = {}
    let loadCount = 0

    images.forEach(img => {
      if (loadedImages[img.id]) {
        newLoadedImages[img.id] = loadedImages[img.id]
        loadCount++
      } else {
        const image = new Image()
        image.onload = () => {
          newLoadedImages[img.id] = image
          loadCount++
          if (loadCount === images.length) {
            setLoadedImages(newLoadedImages)
          }
        }
        image.src = img.src
      }
    })

    if (loadCount === images.length && Object.keys(newLoadedImages).length > 0) {
      setLoadedImages(newLoadedImages)
    }
  }, [images])

  // 캔버스 렌더링
  useEffect(() => {
    if (!ref.current || !layout) return

    const canvas = ref.current
    const ctx = canvas.getContext('2d')

    // 캔버스 크기 설정
    canvas.width = layout.canvasWidth
    canvas.height = layout.canvasHeight

    // 배경색
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 이미지 그리기
    images.forEach(img => {
      const loadedImg = loadedImages[img.id]
      if (!loadedImg) return

      const position = imagePositions[img.id] || { x: 0, y: 0, scale: 1 }

      ctx.save()
      
      // 클리핑 영역 설정
      ctx.beginPath()
      ctx.rect(img.x, img.y, img.width, img.height)
      ctx.clip()

      // 이미지 크기 및 위치 계산
      const scale = position.scale || 1
      const imgRatio = loadedImg.width / loadedImg.height
      const slotRatio = img.width / img.height

      let drawWidth, drawHeight
      if (imgRatio > slotRatio) {
        drawHeight = img.height * scale
        drawWidth = drawHeight * imgRatio
      } else {
        drawWidth = img.width * scale
        drawHeight = drawWidth / imgRatio
      }

      const offsetX = img.x + (img.width - drawWidth) / 2 + position.x
      const offsetY = img.y + (img.height - drawHeight) / 2 + position.y

      ctx.drawImage(loadedImg, offsetX, offsetY, drawWidth, drawHeight)
      ctx.restore()

      // 테두리
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 2
      ctx.strokeRect(img.x, img.y, img.width, img.height)
    })
  }, [ref, layout, images, backgroundColor, loadedImages, imagePositions])

  // 드래그 시작
  const handleMouseDown = (e, img) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const scaleX = layout.canvasWidth / rect.width
    const scaleY = layout.canvasHeight / rect.height

    const position = imagePositions[img.id] || { x: 0, y: 0, scale: 1 }

    setDragState({
      imageId: img.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      scaleX,
      scaleY
    })
  }

  // 드래그 중
  useEffect(() => {
    if (!dragState) return

    const handleMouseMove = (e) => {
      const deltaX = (e.clientX - dragState.startX) * dragState.scaleX
      const deltaY = (e.clientY - dragState.startY) * dragState.scaleY

      onUpdatePosition(dragState.imageId, {
        x: dragState.initialX + deltaX,
        y: dragState.initialY + deltaY
      })
    }

    const handleMouseUp = () => {
      setDragState(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragState, onUpdatePosition])

  // 줌
  const handleWheel = (e, img) => {
    e.preventDefault()
    const position = imagePositions[img.id] || { x: 0, y: 0, scale: 1 }
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.max(0.5, Math.min(3, position.scale + delta))
    
    onUpdatePosition(img.id, { scale: newScale })
  }

  if (!layout) {
    return (
      <div className="canvas-placeholder">
        <p>레이아웃을 선택해주세요</p>
      </div>
    )
  }

  return (
    <div className="canvas-wrapper">
      <div 
        ref={containerRef}
        className="canvas-container"
        style={{
          aspectRatio: `${layout.canvasWidth} / ${layout.canvasHeight}`
        }}
      >
        <canvas ref={ref} className="canvas" />
        
        {/* 드래그 오버레이 */}
        {images.map(img => {
          const rect = containerRef.current?.getBoundingClientRect()
          if (!rect) return null

          const scaleX = rect.width / layout.canvasWidth
          const scaleY = rect.height / layout.canvasHeight

          return (
            <div
              key={img.id}
              className="drag-overlay"
              style={{
                left: `${img.x * scaleX}px`,
                top: `${img.y * scaleY}px`,
                width: `${img.width * scaleX}px`,
                height: `${img.height * scaleY}px`,
                cursor: dragState?.imageId === img.id ? 'grabbing' : 'grab'
              }}
              onMouseDown={(e) => handleMouseDown(e, img)}
              onWheel={(e) => handleWheel(e, img)}
            />
          )
        })}
      </div>
      
      <div className="canvas-hint">
        <p>💡 이미지를 드래그해서 위치를 조정하고, 마우스 휠로 확대/축소할 수 있어요</p>
      </div>
    </div>
  )
})

Canvas.displayName = 'Canvas'

export default Canvas
