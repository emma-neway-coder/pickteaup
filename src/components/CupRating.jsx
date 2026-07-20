import { C, CAT_COLOR } from '../styles.js'

// 아래부터 위로 차오르는 잔 (튀어나오지 않음)
// 확정 스펙: 액체 바닥을 잔 바닥에 고정하고 윗면만 상승
export default function CupRating({ category = 'oolong', value = 0, onChange, size = 42 }) {
  const readOnly = typeof onChange !== 'function'
  const tea = CAT_COLOR[category] || C.clay

  return (
    <div className="cups" role={readOnly ? 'img' : 'group'} aria-label={`${value}잔 / 5잔`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const on = i <= value
        const svg = (
          <svg className="cupsvg" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
            <defs>
              <clipPath id={`cc-${category}-${i}`}>
                <path d="M8 12 Q8 30 20 30 Q32 30 32 12 Z" />
              </clipPath>
            </defs>
            <path d="M8 12 Q8 30 20 30 Q32 30 32 12 Z"
              fill="#FCFAF5" stroke={on ? '#8B7B6A' : '#C9BCA6'} strokeWidth="1.6" />
            <rect x="6" y={on ? 13 : 30} width="28" height={on ? 17 : 0}
              fill={tea} opacity="0.85" clipPath={`url(#cc-${category}-${i})`}
              style={{ transition: 'y .35s cubic-bezier(.3,1.2,.5,1), height .35s cubic-bezier(.3,1.2,.5,1)' }} />
            {on && <ellipse cx="20" cy="13.5" rx="11.5" ry="1.6" fill={tea} opacity=".55" />}
          </svg>
        )
        if (readOnly) return <span key={i}>{svg}</span>
        return (
          <button key={i} type="button" className="cupbtn"
            aria-label={`${i}잔`} aria-pressed={on}
            onClick={() => onChange(value === i ? i - 1 : i)}>
            {svg}
          </button>
        )
      })}
    </div>
  )
}
