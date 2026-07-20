export default function LogoutSheet({ open, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="ovl bottom" onClick={onCancel}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grip" />
        <div className="h2" style={{ marginBottom: 7 }}>로그아웃할까요?</div>
        <p className="muted" style={{ marginBottom: 20 }}>
          기록은 계정에 안전하게 저장돼 있어요. 다시 로그인하면 그대로 이어져요.
        </p>
        <button className="btn" onClick={onConfirm} style={{ marginBottom: 8 }}>로그아웃</button>
        <button className="btn-plain" onClick={onCancel}>돌아가기</button>
      </div>
    </div>
  )
}
