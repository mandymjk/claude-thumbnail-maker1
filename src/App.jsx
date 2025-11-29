import { useState, useRef, useEffect } from 'react'
import LayoutSelector from './components/LayoutSelector'
import ImageUploader from './components/ImageUploader'
import Canvas from './components/Canvas'
import Controls from './components/Controls'
import { LAYOUTS } from './constants/layouts'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(1) // 1: 레이아웃, 2: 이미지, 3: 편집
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [uploadedImages, setUploadedImages] = useState([])
  const [canvasImages, setCanvasImages] = useState([])
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [imagePositions, setImagePositions] = useState({})
  const canvasRef = useRef(null)

  // 레이아웃 변경 시 캔버스 이미지 재배치
  useEffect(() => {
    if (selectedLayout && uploadedImages.length > 0) {
      arrangeImages()
    }
  }, [selectedLayout, uploadedImages])

  const arrangeImages = () => {
    if (!selectedLayout) return

    const layout = LAYOUTS.find(l => l.id === selectedLayout)
    const newCanvasImages = uploadedImages.slice(0, layout.slots).map((img, index) => ({
      id: `img-${Date.now()}-${index}`,
      src: img,
      slot: index,
      ...layout.positions[index]
    }))

    setCanvasImages(newCanvasImages)
    
    const initialPositions = {}
    newCanvasImages.forEach(img => {
      initialPositions[img.id] = { x: 0, y: 0, scale: 1 }
    })
    setImagePositions(initialPositions)
  }

  const handleLayoutSelect = (layoutId) => {
    setSelectedLayout(layoutId)
    setCurrentStep(2)
  }

  const handleImageUpload = (files) => {
    const imageUrls = Array.from(files).map(file => URL.createObjectURL(file))
    setUploadedImages(prev => [...prev, ...imageUrls])
  }

  const handleRemoveImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleImagesComplete = () => {
    if (uploadedImages.length > 0) {
      setCurrentStep(3)
    }
  }

  const updateImagePosition = (imageId, updates) => {
    setImagePositions(prev => ({
      ...prev,
      [imageId]: {
        ...prev[imageId],
        ...updates
      }
    }))
  }

  const handleDownload = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `thumbnail-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleReset = () => {
    setCurrentStep(1)
    setSelectedLayout(null)
    setUploadedImages([])
    setCanvasImages([])
    setBackgroundColor('#ffffff')
    setImagePositions({})
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="app">
      {/* 모바일 헤더 */}
      <div className="mobile-header">
        {currentStep > 1 && (
          <button className="back-button" onClick={handleBack}>
            ← 이전
          </button>
        )}
        <h1>썸네일 메이커</h1>
        <div className="step-indicator">
          <span className={currentStep >= 1 ? 'active' : ''}>1</span>
          <span className={currentStep >= 2 ? 'active' : ''}>2</span>
          <span className={currentStep >= 3 ? 'active' : ''}>3</span>
        </div>
      </div>

      {/* Step 1: 레이아웃 선택 */}
      {currentStep === 1 && (
        <div className="step-container">
          <div className="step-content">
            <div className="step-header">
              <h2>레이아웃을 선택하세요</h2>
              <p>원하는 이미지 구성을 골라주세요</p>
            </div>
            <LayoutSelector
              selectedLayout={selectedLayout}
              onSelectLayout={handleLayoutSelect}
            />
          </div>
        </div>
      )}

      {/* Step 2: 이미지 업로드 */}
      {currentStep === 2 && (
        <div className="step-container">
          <div className="step-content">
            <div className="step-header">
              <h2>이미지를 업로드하세요</h2>
              <p>
                {selectedLayout && LAYOUTS.find(l => l.id === selectedLayout)?.name} 레이아웃에는 
                최대 {selectedLayout && LAYOUTS.find(l => l.id === selectedLayout)?.slots}장의 이미지가 필요해요
              </p>
            </div>
            <ImageUploader
              uploadedImages={uploadedImages}
              onUpload={handleImageUpload}
              onRemove={handleRemoveImage}
              maxImages={selectedLayout ? LAYOUTS.find(l => l.id === selectedLayout)?.slots : 0}
            />
          </div>
          <div className="step-footer">
            <button
              className="footer-button primary"
              onClick={handleImagesComplete}
              disabled={uploadedImages.length === 0}
            >
              다음 단계
            </button>
          </div>
        </div>
      )}

      {/* Step 3: 편집 및 다운로드 */}
      {currentStep === 3 && (
        <div className="step-container edit-step">
          <div className="canvas-section">
            <Canvas
              ref={canvasRef}
              layout={selectedLayout ? LAYOUTS.find(l => l.id === selectedLayout) : null}
              images={canvasImages}
              backgroundColor={backgroundColor}
              imagePositions={imagePositions}
              onUpdatePosition={updateImagePosition}
            />
          </div>
          
          <div className="controls-section">
            <div className="step-header">
              <h2>배경색을 선택하세요</h2>
            </div>
            <Controls
              backgroundColor={backgroundColor}
              onBackgroundColorChange={setBackgroundColor}
            />
          </div>

          <div className="step-footer">
            <button
              className="footer-button secondary"
              onClick={handleReset}
            >
              처음부터
            </button>
            <button
              className="footer-button primary"
              onClick={handleDownload}
            >
              다운로드
            </button>
          </div>
        </div>
      )}

      {/* 데스크톱 뷰 (기존 레이아웃) */}
      <div className="desktop-view">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>썸네일 메이커</h1>
            <p>레이아웃을 선택하고 이미지를 업로드하세요</p>
          </div>

          <div className="sidebar-content">
            <LayoutSelector
              selectedLayout={selectedLayout}
              onSelectLayout={setSelectedLayout}
            />

            <ImageUploader
              uploadedImages={uploadedImages}
              onUpload={handleImageUpload}
              onRemove={handleRemoveImage}
              maxImages={selectedLayout ? LAYOUTS.find(l => l.id === selectedLayout)?.slots : 0}
            />

            <Controls
              backgroundColor={backgroundColor}
              onBackgroundColorChange={setBackgroundColor}
            />
          </div>

          <div className="sidebar-footer">
            <button
              className="footer-button primary"
              onClick={handleDownload}
              disabled={!selectedLayout || canvasImages.length === 0}
            >
              다운로드
            </button>
            <button
              className="footer-button secondary"
              onClick={handleReset}
            >
              초기화
            </button>
          </div>
        </div>

        <div className="main-content">
          <Canvas
            ref={canvasRef}
            layout={selectedLayout ? LAYOUTS.find(l => l.id === selectedLayout) : null}
            images={canvasImages}
            backgroundColor={backgroundColor}
            imagePositions={imagePositions}
            onUpdatePosition={updateImagePosition}
          />
        </div>
      </div>
    </div>
  )
}

export default App
