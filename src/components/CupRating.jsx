import { C } from '../styles.js'

// 카테고리별 찻잔 실루엣 (목업과 동일 스펙)
function cupPaths(cat, filled) {
  const liquid = {
    green: C.teaGreen, oolong: C.teaOolong, puer: C.teaPuer,
    black: C.teaBlack, flower: C.teaFlower,
  }[cat] || C.teaOolong

  const stroke = filled ? C.ink : C.inkSoft
  const op = filled ? 1 : 0.5
  const sw = cat === 'puer' ? 2.1 : cat === 'flower' ? 1.05 : 1.4
  const common = { fill: 'none', stroke, strokeWidth: sw, strokeLinejoin: 'round', strokeLinecap: 'round', opacity: op }

  switch (cat) {
    case 'green':
      return (
        <>
          {filled && <ellipse cx="22" cy="19.5" rx="11.5" ry="2.7" fill={liquid} />}
          <path d="M8.5,18 C8.5,25 13,29 22,29 C31,29 35.5,25 35.5,18" {...common} />
          <ellipse cx="22" cy="18" rx="13.5" ry="3.4" {...common} />
        </>
      )
    case 'oolong':
      return (
        <>
          {filled && <ellipse cx="22" cy="18.2" rx="7" ry="1.9" fill={liquid} />}
          <path d="M13.5,17 C14,23 16.5,28.5 22,28.5 C27.5,28.5 30,23 30.5,17" {...common} />
          <ellipse cx="22" cy="17" rx="8.5" ry="2.2" {...common} />
          <ellipse cx="22" cy="28.5" rx="4" ry="1" {...common} />
        </>
      )
    case 'puer':
      return (
        <>
          {filled && <ellipse cx="22" cy="21" rx="8" ry="2.3" fill={liquid} />}
          <path d="M13.5,20 C13.5,20 12.5,29 22,29 C31.5,29 30.5,20 30.5,20" {...common} />
          <ellipse cx="22" cy="20" rx="9" ry="2.6" {...common} />
        </>
      )
    case 'black':
      return (
        <>
          {filled && <ellipse cx="20" cy="19" rx="6.5" ry="1.9" fill={liquid} />}
          <ellipse cx="21" cy="31.5" rx="12" ry="2.6" fill="none" stroke={C.inkSoft} strokeWidth="1.1" opacity={filled ? 0.75 : 0.35} />
          <path d="M12,18 C12,24 15,28 20,28 C25,28 28,24 28,18" {...common} />
          <ellipse cx="20" cy="18" rx="8" ry="2.2" {...common} />
          <path d="M28.2,20 C33,19.5 33.5,26 27.4,25.6" {...common} />
        </>
      )
    case 'flower':
      return (
        <>
          {filled && <path d="M15,21 L29,21 L27.5,30 C27.5,31.5 16.5,31.5 16.5,30 Z" fill={liquid} />}
          <path d="M14.5,17 L29.5,17 L27.5,31 C27.5,33 16.5,33 16.5,31 Z" {...common} />
          <ellipse cx="22" cy="17" rx="7.5" ry="1.9" {...common} />
          <line x1="18" y1="20" x2="17" y2="29" stroke="#fff" strokeWidth="1.1" opacity="0.55" />
        </>
      )
    default:
      return null
  }
}

// value: 0~5, category: 카테고리 key
// onChange 있으면 입력 모드(탭), 없으면 읽기 전용
export default function CupRating({ category = 'oolong', value = 0, onChange, size = 30 }) {
  const readOnly = typeof onChange !== 'function'
  const cups = [1, 2, 3, 4, 5]

  return (
    <div role={readOnly ? 'img' : 'group'} aria-label={`${value}잔 (5잔 만점)`} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {cups.map((i) => {
        const filled = i <= value
        const svg = (
          <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
            {cupPaths(category, filled)}
          </svg>
        )
        if (readOnly) return <span key={i}>{svg}</span>
        return (
          <button
            key={i}
            type="button"
            aria-label={`${i}잔`}
            aria-pressed={filled}
            onClick={() => onChange(value === i ? i - 1 : i)}
            style={{ background: 'none', border: 'none', padding: 2, lineHeight: 0, borderRadius: 8 }}
          >
            {svg}
          </button>
        )
      })}
    </div>
  )
}
