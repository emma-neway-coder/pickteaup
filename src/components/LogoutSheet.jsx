import { C, serif } from '../styles.js'

export default function LogoutSheet({ open, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(40,32,24,.38)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480, background: C.surface,
          borderRadius: '20px 20px 0 0', padding: '22px 20px calc(22px + env(safe-area-inset-bottom))',
          boxShadow: '0 -8px 30px rgba(40,32,24,.14)',
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 2, background: C.line, margin: '0 auto 18px' }} />
        <div style={{ fontFamily: serif, fontSize: 17, marginBottom: 6 }}>로그아웃할까요?</div>
        <p style={{ color: C.inkSoft, fontSize: 13, marginBottom: 20 }}>
          기록은 계정에 안전하게 저장돼 있어요. 다시 로그인하면 그대로 이어져요.
        </p>
        <button
          onClick={onConfirm}
          style={{ width: '100%', padding: 13, border: 'none', borderRadius: 12, background: C.ink, color: C.paper, fontSize: 14, marginBottom: 8 }}
        >
          로그아웃
        </button>
        <button
          onClick={onCancel}
          style={{ width: '100%', padding: 13, border: `1px solid ${C.line}`, borderRadius: 12, background: C.surface, color: C.ink, fontSize: 14 }}
        >
          돌아가기
        </button>
      </div>
    </div>
  )
}
