import { useState } from 'react'
import {
  signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase.js'

function msg(code) {
  switch (code) {
    case 'auth/invalid-email': return '이메일 형식이 맞지 않아요.'
    case 'auth/missing-password': return '비밀번호를 입력해주세요.'
    case 'auth/weak-password': return '비밀번호는 6자 이상이어야 해요.'
    case 'auth/email-already-in-use': return '이미 가입된 이메일이에요. 로그인해 주세요.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found': return '이메일 또는 비밀번호가 맞지 않아요.'
    case 'auth/popup-closed-by-user': return '창이 닫혔어요. 다시 시도해 주세요.'
    case 'auth/unauthorized-domain': return '이 도메인은 아직 승인되지 않았어요.'
    default: return '로그인 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.'
  }
}

export default function AuthPanel({ title = '로그인하고 계속하기', note }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function google() {
    setErr(''); setBusy(true)
    try { await signInWithPopup(auth, googleProvider) }
    catch (e) { setErr(msg(e.code)) }
    finally { setBusy(false) }
  }

  async function byEmail() {
    setErr(''); setBusy(true)
    try {
      if (mode === 'signup') await createUserWithEmailAndPassword(auth, email.trim(), pw)
      else await signInWithEmailAndPassword(auth, email.trim(), pw)
    } catch (e) { setErr(msg(e.code)) }
    finally { setBusy(false) }
  }

  // 모든 컨트롤 동일 폭·동일 높이·동일 라운드(16px) — 대칭 정렬
  return (
    <div style={{ maxWidth: 340, margin: '0 auto', display: 'grid', gap: 0 }}>
      <div className="h2" style={{ textAlign: 'center', marginBottom: note ? 6 : 18 }}>{title}</div>
      {note && <p className="muted" style={{ textAlign: 'center', marginBottom: 18 }}>{note}</p>}

      <button
        className="btn-glass" onClick={google} disabled={busy}
        style={{ borderRadius: 16, padding: '13px 18px' }}
      >
        <GoogleG /> Google로 계속하기
      </button>

      <div className="divider">또는</div>

      <div style={{ display: 'grid', gap: 9 }}>
        <input className="field" style={{ borderRadius: 16, padding: '13px 15px' }}
          type="email" inputMode="email" autoComplete="email" placeholder="이메일"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="field" style={{ borderRadius: 16, padding: '13px 15px' }}
          type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          placeholder="비밀번호 (6자 이상)"
          value={pw} onChange={(e) => setPw(e.target.value)} />
        <button className="btn sym" onClick={byEmail} disabled={busy}>
          {busy ? '잠시만요…' : mode === 'signup' ? '이메일로 가입' : '이메일로 로그인'}
        </button>
      </div>

      {err && <p className="tiny" style={{ color: 'var(--clay)', textAlign: 'center', marginTop: 10 }}>{err}</p>}

      <button className="ghost u" style={{ width: '100%', marginTop: 14 }}
        onClick={() => { setErr(''); setMode(mode === 'signup' ? 'signin' : 'signup') }}>
        {mode === 'signup' ? '이미 계정이 있어요 · 로그인' : '처음이에요 · 이메일로 가입'}
      </button>
    </div>
  )
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 0 1-2 3.018v2.51h3.232C18.51 15.836 19.6 13.273 19.6 10.227Z" fill="#4285F4" />
      <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.51c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59C2.71 17.76 6.09 20 10 20Z" fill="#34A853" />
      <path d="M4.405 11.9A5.99 5.99 0 0 1 4.09 10c0-.66.114-1.3.314-1.9V5.51H1.064A9.98 9.98 0 0 0 0 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59Z" fill="#FBBC04" />
      <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.96.991 12.695 0 10 0 6.09 0 2.71 2.241 1.064 5.51l3.34 2.59C5.19 5.737 7.395 3.977 10 3.977Z" fill="#E94235" />
    </svg>
  )
}
