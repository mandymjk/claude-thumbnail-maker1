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
  const [touchState, setTouchState] = useState(null)
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

  // 터치 관련 유틸리티 함수
  const getTouchDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getTouchCenter = (touch1, touch2) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    }
  }

  // 터치 시작
  const handleTouchStart = (e, img) => {
    if (!containerRef.current) return

    const touches = e.touches

    // 단일 터치 - 드래그
    if (touches.length === 1) {
      const rect = containerRef.current.getBoundingClientRect()
      const scaleX = layout.canvasWidth / rect.width
      const scaleY = layout.canvasHeight / rect.height
      const position = imagePositions[img.id] || { x: 0, y: 0, scale: 1 }

      setTouchState({
        imageId: img.id,
        type: 'drag',
        startX: touches[0].clientX,
        startY: touches[0].clientY,
        initialX: position.x,
        initialY: position.y,
        scaleX,
        scaleY
      })
    }

    // 두 손가락 터치 - 핀치
    else if (touches.length === 2) {
      const rect = containerRef.current.getBoundingClientRect()
      const position = imagePositions[img.id] || { x: 0, y: 0, scale: 1 }
      const initialDistance = getTouchDistance(touches[0], touches[1])
      const center = getTouchCenter(touches[0], touches[1])

      setTouchState({
        imageId: img.id,
        type: 'pinch',
        initialDistance,
        initialScale: position.scale,
        centerX: center.x,
        centerY: center.y
      })
    }
  }

  // 터치 이동
  const handleTouchMove = (e, img) => {
    if (!touchState || !containerRef.current) return

    e.preventDefault()
    const touches = e.touches

    // 드래그
    if (touchState.type === 'drag' && touches.length === 1) {
      const deltaX = (touches[0].clientX - touchState.startX) * touchState.scaleX
      const deltaY = (touches[0].clientY - touchState.startY) * touchState.scaleY

      onUpdatePosition(touchState.imageId, {
        x: touchState.initialX + deltaX,
        y: touchState.initialY + deltaY
      })
    }

    // 핀치
    else if (touchState.type === 'pinch' && touches.length === 2) {
      const currentDistance = getTouchDistance(touches[0], touches[1])
      const scale = currentDistance / touchState.initialDistance
      const newScale = Math.max(0.5, Math.min(3, touchState.initialScale * scale))

      onUpdatePosition(touchState.imageId, { scale: newScale })
    }
  }

  // 터치 종료
  const handleTouchEnd = () => {
    setTouchState(null)
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
              onTouchStart={(e) => handleTouchStart(e, img)}
              onTouchMove={(e) => handleTouchMove(e, img)}
              onTouchEnd={handleTouchEnd}
            />
          )
        })}
      </div>
      
      {images.length > 0 && (
        <div className="canvas-hint">
          <p>💡 이미지를 움직여 위치를 조정하고, 확대/축소해 보세요</p>
        </div>
      )}
    </div>
  )
})

Canvas.displayName = 'Canvas'

export default Canvas
