import { useRef } from 'react'
import { Upload, X } from 'lucide-react'
import './ImageUploader.css'

function ImageUploader({ uploadedImages, onUpload, onRemove, maxImages, hideTitle = false }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      onUpload(files)
      e.target.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="image-uploader">
      {!hideTitle && (
        <h2 className="section-title">
          사진 선택
          {maxImages > 0 && (
            <span className="image-count">
              ({uploadedImages.length}/{maxImages})
            </span>
          )}
        </h2>
      )}

      <button
        className="upload-button"
        onClick={handleClick}
        disabled={!maxImages || uploadedImages.length >= maxImages}
      >
        <Upload size={20} />
        <span>이미지 업로드</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {uploadedImages.length > 0 && (
        <div className="uploaded-images">
          {uploadedImages.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image} alt={`업로드 ${index + 1}`} />
              <button
                className="remove-button"
                onClick={() => onRemove(index)}
                aria-label="이미지 삭제"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!maxImages && !hideTitle && (
        <p className="upload-hint">먼저 레이아웃을 선택해주세요</p>
      )}
    </div>
  )
}

export default ImageUploader
