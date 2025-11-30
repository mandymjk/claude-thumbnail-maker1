import { useState, useRef, useEffect } from 'react'
import LayoutSelector from './components/LayoutSelector'
import ImageUploader from './components/ImageUploader'
import Canvas from './components/Canvas'
import Controls from './components/Controls'
import ListSelectModal from './components/ListSelectModal'
import { LAYOUTS } from './constants/layouts'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(1) // 1: 레이아웃, 2: 이미지, 3: 편집
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [uploadedImages, setUploadedImages] = useState([])
  const [canvasImages, setCanvasImages] = useState([])
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [imagePositions, setImagePositions] = useState({})
  const [showListModal, setShowListModal] = useState(false)
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
    const layout = selectedLayout ? LAYOUTS.find(l => l.id === selectedLayout) : null
    const maxSlots = layout ? layout.slots : Infinity
    
    const imageUrls = Array.from(files).map(file => URL.createObjectURL(file))
    
    setUploadedImages(prev => {
      const combined = [...prev, ...imageUrls]
      // 최대 슬롯 수만큼만 유지
      return combined.slice(0, maxSlots)
    })
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

  const handleDownload = async () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile) {
      // 모바일: Web Share API로 갤러리 저장
      canvas.toBlob(async (blob) => {
        if (!blob) return

        try {
          const file = new File([blob], `thumbnail-${Date.now()}.png`, { type: 'image/png' })
          
          // Web Share API 사용 (사용자가 "사진에 저장" 선택 가능)
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: '썸네일 이미지',
              text: '이미지를 저장하려면 "사진에 저장"을 선택하세요'
            })
          } else {
            // Web Share API 미지원 시: 안내 메시지
            alert('이 브라우저는 이미지 저장을 지원하지 않습니다.\nChrome 또는 Safari를 사용해주세요.')
          }
        } catch (error) {
          // 사용자가 취소한 경우는 무시
          if (error.name !== 'AbortError') {
            console.error('Share error:', error)
          }
        }
      }, 'image/png')
    } else {
      // 데스크톱: 파일 다운로드
      canvas.toBlob((blob) => {
        if (!blob) return

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `thumbnail-${Date.now()}.png`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
      }, 'image/png')
    }
  }

  const handleReset = () => {
    setCurrentStep(1)
    setSelectedLayout(null)
    setUploadedImages([])
    setCanvasImages([])
    setBackgroundColor('#ffffff')
    setImagePositions({})
  }

  const handleSetListImage = () => {
    setShowListModal(true)
  }

  const handleCloseModal = () => {
    setShowListModal(false)
  }

  const handleGoToFlo = () => {
    setShowListModal(false)
    
    // 음악 FLO 앱 딥링크
    const floDeepLink = 'flomusic://view/my' //  
    const floWebUrl = 'https://www.music-flo.com' //  웹사이트
    const floAppStore = 'https://apps.apple.com/kr/app/flo/id1129048043' // iOS 앱스토어
    const floPlayStore = 'https://play.google.com/store/apps/details?id=com.skt.skaf.l001mtm091' // Android 플레이스토어
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    const isAndroid = /Android/i.test(navigator.userAgent)
    
    if (isMobile) {
      // 앱 열기 시도
      window.location.href = floDeepLink
      
      // 앱이 설치되지 않은 경우 스토어로 이동
      setTimeout(() => {
        if (isIOS) {
          window.location.href = floAppStore
        } else if (isAndroid) {
          window.location.href = floPlayStore
        } else {
          window.location.href = floWebUrl
        }
      }, 1500)
    } else {
      // 데스크톱에서는 웹으로 이동
      window.open(floWebUrl, '_blank')
    }
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
        {currentStep > 1 ? (
          <button className="back-button" onClick={handleBack} aria-label="이전">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        ) : (
          <div style={{ width: '40px' }}></div>
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
              <h2>사진을 선택하세요</h2>
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
              disabled={
                uploadedImages.length === 0 ||
                uploadedImages.length < (selectedLayout ? LAYOUTS.find(l => l.id === selectedLayout)?.slots : 0)
              }
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
              className="footer-button primary full-width"
              onClick={handleSetListImage}
            >
              내 리스트 썸네일로 설정
            </button>
            <div className="footer-button-group">
              <button
                className="footer-button secondary icon-button"
                onClick={handleDownload}
                title="저장하기"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <button
                className="footer-button secondary icon-button"
                onClick={handleReset}
                title="처음부터"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
              </button>
            </div>
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
              onClick={handleSetListImage}
            >
              내 리스트 썸네일로 설정
            </button>
            <button
              className="footer-button secondary icon-button"
              onClick={handleDownload}
              title="저장하기"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <button
                className="footer-button secondary icon-button"
                onClick={handleReset}
                title="초기화"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
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

      {/* 리스트 선택 모달 */}
      <ListSelectModal
        isOpen={showListModal}
        onClose={handleCloseModal}
        onConfirm={handleGoToFlo}
      />
    </div>
  )
}

export default App
