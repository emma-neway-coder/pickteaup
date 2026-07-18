import { useState } from 'react'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase.js'
import { C, serif } from '../styles.js'

function messageFor(code) {
  switch (code) {
    case 'auth/invalid-email': return '이메일 형식이 맞지 않아요.'
    case 'auth/missing-password': return '비밀번호를 입력해주세요.'
    case 'auth/weak-password': return '비밀번호는 6자 이상이어야 해요.'
    case 'auth/email-already-in-use': return '이미 가입된 이메일이에요. 로그인해 주세요.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found': return '이메일 또는 비밀번호가 맞지 않아요.'
    case 'auth/popup-closed-by-user': return '창이 닫혔어요. 다시 시도해 주세요.'
    case 'auth/unauthorized-domain': return '이 도메인은 아직 승인되지 않았어요. (Firebase 승인된 도메인 설정 필요)'
    default: return '로그인 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.'
  }
}

export default function AuthPanel({ title = '로그인하고 계속하기', note }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function google() {
    setErr(''); setBusy(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      setErr(messageFor(e.code))
    } finally {
      setBusy(false)
    }
  }

  async function email_() {
    setErr(''); setBusy(true)
    try {
      if (mode === 'signup') await createUserWithEmailAndPassword(auth, email.trim(), pw)
      else await signInWithEmailAndPassword(auth, email.trim(), pw)
    } catch (e) {
      setErr(messageFor(e.code))
    } finally {
      setBusy(false)
    }
  }

  const field = {
    width: '100%', padding: '11px 12px', fontSize: 14,
    border: `1px solid ${C.line}`, borderRadius: 10, background: C.surface, color: C.ink,
    marginBottom: 8,
  }

  return (
    <div style={{ maxWidth: 360, margin: '0 auto' }}>
      <div style={{ fontFamily: serif, fontSize: 18, marginBottom: note ? 4 : 14, textAlign: 'center' }}>
        {title}
      </div>
      {note && <p style={{ color: C.inkSoft, fontSize: 13, textAlign: 'center', marginBottom: 16 }}>{note}</p>}

      <button onClick={google} disabled={busy} style={{
        width: '100%', padding: '12px', fontSize: 14, marginBottom: 14,
        border: `1px solid ${C.line}`, borderRadius: 12, background: '#fff', color: C.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <GoogleG /> 구글로 계속하기
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.inkSoft, fontSize: 12, margin: '4px 0 14px' }}>
        <div style={{ flex: 1, height: 1, background: C.line }} />
        또는
        <div style={{ flex: 1, height: 1, background: C.line }} />
      </div>

      <input style={field} type="email" inputMode="email" autoComplete="email"
        placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input style={field} type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        placeholder="비밀번호 (6자 이상)" value={pw} onChange={(e) => setPw(e.target.value)} />

      <button onClick={email_} disabled={busy} style={{
        width: '100%', padding: '12px', fontSize: 14,
        border: 'none', borderRadius: 12, background: C.ink, color: C.paper, marginTop: 2,
      }}>
        {busy ? '잠시만요…' : mode === 'signup' ? '이메일로 가입' : '이메일로 로그인'}
      </button>

      {err && <p style={{ color: C.amber, fontSize: 12.5, marginTop: 10, textAlign: 'center' }}>{err}</p>}

      <button
        onClick={() => { setErr(''); setMode(mode === 'signup' ? 'signin' : 'signup') }}
        style={{ background: 'none', border: 'none', color: C.inkSoft, fontSize: 12.5, marginTop: 14, width: '100%', textAlign: 'center', textDecoration: 'underline' }}
      >
        {mode === 'signup' ? '이미 계정이 있어요 · 로그인' : '처음이에요 · 이메일로 가입'}
      </button>
    </div>
  )
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-2.8-.4-4.1H24v7.8h12.5c-.3 2.1-1.6 5.2-4.6 7.3l7.1 5.5c4.2-3.9 6.6-9.6 6.6-16.5z" />
      <path fill="#FBBC05" d="M10.4 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.1-5.5c-1.9 1.3-4.5 2.3-8.1 2.3-6.4 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  )
}
