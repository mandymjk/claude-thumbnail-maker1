import './ListSelectModal.css'

function ListSelectModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-body">
          <h3 className="modal-title">썸네일을 설정할 내 리스트를 선택해 주세요.</h3>
          <p className="modal-subtitle">썸네일은 비공개 리스트에만 설정할 수 있습니다.</p>
        </div>
        
        <div className="modal-footer">
          <button className="modal-button cancel" onClick={onClose}>
            취소
          </button>
          <button className="modal-button confirm" onClick={onConfirm}>
            선택하러 가기
          </button>
        </div>
      </div>
    </div>
  )
}

export default ListSelectModal

