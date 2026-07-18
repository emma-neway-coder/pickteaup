import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, firebaseReady } from './firebase.js'
import { QUESTIONS, topPicks } from './recommend.js'
import {
  CATEGORIES, CATEGORY_ORDER, TEAS, teaById, categoryOf, TASTE_DISCLAIMER,
} from './data/catalog.js'
import {
  loadRecords, saveRecord, deleteRecord, mergeAnonIntoUser, newId,
} from './storage.js'
import { C, serif } from './styles.js'
import CupRating from './components/CupRating.jsx'
import AuthPanel from './components/AuthPanel.jsx'
import LogoutSheet from './components/LogoutSheet.jsx'

const TASTE_TAGS = ['산뜻', '고소', '꽃향', '과일향', '진함', '부드러움', '떫음', '달큰']

export default function App() {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [tab, setTab] = useState('today')
  const [records, setRecords] = useState([])
  const [recordFor, setRecordFor] = useState(null) // 기록 대상 tea
  const [authOpen, setAuthOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  // 인증 상태 구독 + 로그인 시 익명 기록 병합
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null)
      setAuthReady(true)
      if (u) {
        try { await mergeAnonIntoUser(u.uid) } catch { /* noop */ }
      }
      const recs = await loadRecords(u ? u.uid : null)
      setRecords(recs)
    })
    return unsub
  }, [])

  async function refresh() {
    setRecords(await loadRecords(user ? user.uid : null))
  }

  async function handleSave(rec) {
    await saveRecord(user ? user.uid : null, rec)
    setRecordFor(null)
    await refresh()
    setTab('archive')
  }

  async function handleDelete(id) {
    await deleteRecord(user ? user.uid : null, id)
    await refresh()
  }

  async function doLogout() {
    setLogoutOpen(false)
    try { await signOut(auth) } catch { /* noop */ }
    setRecords(await loadRecords(null))
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 40px', minHeight: '100vh' }}>
      <Header
        user={user}
        onLogin={() => setAuthOpen(true)}
        onLogout={() => setLogoutOpen(true)}
      />

      {!firebaseReady && <ConfigBanner />}

      <Tabs tab={tab} setTab={setTab} />

      <div style={{ padding: '0 18px' }}>
        {tab === 'today' && (
          <TodayView onRecord={(tea) => setRecordFor(tea)} />
        )}
        {tab === 'archive' && (
          <ArchiveView
            records={records}
            user={user}
            authReady={authReady}
            onDelete={handleDelete}
            onLogin={() => setAuthOpen(true)}
            onGoToday={() => setTab('today')}
          />
        )}
        {tab === 'guide' && <GuideView onRecord={(tea) => setRecordFor(tea)} />}
      </div>

      {recordFor && (
        <RecordSheet
          tea={recordFor}
          user={user}
          onClose={() => setRecordFor(null)}
          onSave={handleSave}
          onLogin={() => setAuthOpen(true)}
        />
      )}

      {authOpen && (
        <Overlay onClose={() => setAuthOpen(false)}>
          <AuthPanel
            title="로그인하고 계속하기"
            note="기록을 계정에 저장하고, 어느 기기에서든 이어서 보려면 로그인하세요."
          />
        </Overlay>
      )}

      <LogoutSheet open={logoutOpen} onConfirm={doLogout} onCancel={() => setLogoutOpen(false)} />
    </div>
  )
}

/* ── 헤더 ── */
function Header({ user, onLogin, onLogout }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 18px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <TeacupMark />
        <span style={{ fontFamily: serif, fontSize: 18, fontWeight: 700 }}>픽티업</span>
      </div>
      {user ? (
        <button onClick={onLogout} style={ghostBtn}>
          {user.email ? user.email.split('@')[0] : '내 계정'} · 로그아웃
        </button>
      ) : (
        <button onClick={onLogin} style={ghostBtn}>로그인</button>
      )}
    </header>
  )
}

// 고양이 귀 찻잔 마크 (좌상단)
function TeacupMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 44 44" aria-hidden="true">
      <path d="M13,13 L11,7 L17,11 M31,13 L33,7 L27,11" fill="none" stroke={C.ink} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M11,16 C11,24 15,29 22,29 C29,29 33,24 33,16" fill="none" stroke={C.ink} strokeWidth="1.6" />
      <ellipse cx="22" cy="16" rx="11" ry="2.8" fill="none" stroke={C.ink} strokeWidth="1.6" />
      <path d="M33,19 C37,18.5 37.5,25 31.5,24.6" fill="none" stroke={C.ink} strokeWidth="1.6" />
      <ellipse cx="22" cy="17.5" rx="8.5" ry="1.8" fill={C.teaOolong} />
    </svg>
  )
}

/* ── Firebase 미설정 안내 ── */
function ConfigBanner() {
  return (
    <div style={{
      margin: '0 18px 8px', padding: '10px 12px', fontSize: 12, lineHeight: 1.6,
      background: '#FBF1E6', border: `1px solid ${C.line}`, borderRadius: 10, color: C.ink,
    }}>
      Firebase 설정이 아직 비어 있어요. <b>src/firebase.js</b>에 콘솔 config를 넣으면
      로그인·저장이 켜져요. 지금은 이 기기에만 임시로 저장돼요.
    </div>
  )
}

/* ── 탭 ── */
function Tabs({ tab, setTab }) {
  const items = [
    { key: 'today', label: '오늘 마실 차' },
    { key: 'archive', label: '내 찻장' },
    { key: 'guide', label: '차 도감' },
  ]
  return (
    <nav style={{ display: 'flex', gap: 6, padding: '4px 18px 18px' }}>
      {items.map((it) => {
        const on = tab === it.key
        return (
          <button
            key={it.key}
            onClick={() => setTab(it.key)}
            style={{
              flex: 1, padding: '9px 0', fontSize: 13.5, borderRadius: 11,
              border: `1px solid ${on ? C.ink : C.line}`,
              background: on ? C.ink : C.surface, color: on ? C.paper : C.inkSoft,
              fontFamily: serif,
            }}
          >
            {it.label}
          </button>
        )
      })}
    </nav>
  )
}

/* ── 오늘 마실 차 (추천) ── */
function TodayView({ onRecord }) {
  const [answers, setAnswers] = useState({})
  const done = QUESTIONS.every((q) => answers[q.id])
  const picks = done ? topPicks(answers, 3) : []

  function pick(qid, value) {
    setAnswers((a) => ({ ...a, [qid]: value }))
  }

  if (!done) {
    const current = QUESTIONS.find((q) => !answers[q.id])
    const idx = QUESTIONS.indexOf(current)
    return (
      <section>
        <Kicker>추천 · {idx + 1} / {QUESTIONS.length}</Kicker>
        <h2 style={h2}>{current.q}</h2>
        <div style={{ display: 'grid', gap: 8, marginTop: 4 }}>
          {current.options.map((o) => (
            <button key={o.value} onClick={() => pick(current.id, o.value)} style={choiceBtn}>
              {o.label}
            </button>
          ))}
        </div>
        {idx > 0 && (
          <button onClick={() => setAnswers({})} style={{ ...ghostBtn, marginTop: 16 }}>
            처음부터 다시
          </button>
        )}
      </section>
    )
  }

  return (
    <section>
      <Kicker>오늘의 추천</Kicker>
      <h2 style={h2}>이런 차는 어때요?</h2>
      <div style={{ display: 'grid', gap: 12, marginTop: 6 }}>
        {picks.length === 0 && (
          <p style={{ color: C.inkSoft, fontSize: 14 }}>
            딱 맞는 차를 못 찾았어요. 조건을 바꿔볼까요?
          </p>
        )}
        {picks.map(({ tea, reasons }) => {
          const cat = categoryOf(tea.cat)
          return (
            <article key={tea.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 700 }}>{tea.name}</div>
                <div style={{ fontSize: 11, color: C.inkSoft }}>{cat?.name}</div>
              </div>
              <p style={{ fontSize: 13, color: C.ink, margin: '6px 0 8px' }}>{tea.taste}</p>
              {reasons.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                  {reasons.map((r) => (
                    <span key={r} style={chip}>{r}</span>
                  ))}
                </div>
              )}
              <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 12 }}>우림 · {tea.brew}</div>
              <button onClick={() => onRecord(tea)} style={primaryBtn}>이 차 기록하기</button>
            </article>
          )
        })}
      </div>
      <button onClick={() => setAnswers({})} style={{ ...ghostBtn, marginTop: 16 }}>
        다시 골라보기
      </button>
      <Disclaimer />
    </section>
  )
}

/* ── 내 찻장 (아카이브) ── */
function ArchiveView({ records, user, authReady, onDelete, onLogin, onGoToday }) {
  const [filter, setFilter] = useState('all')
  const shown = filter === 'all' ? records : records.filter((r) => r.category === filter)

  return (
    <section>
      <Kicker>내 찻장</Kicker>
      <h2 style={h2}>마신 차, {records.length}잔</h2>

      {!user && authReady && (
        <div style={{ ...card, marginTop: 6, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: C.ink, marginBottom: 10 }}>
            지금 기록은 이 기기에만 저장돼요. 로그인하면 계정에 안전하게 옮겨드리고,
            다른 기기에서도 이어서 볼 수 있어요.
          </p>
          <button onClick={onLogin} style={primaryBtn}>로그인하고 계정에 저장</button>
        </div>
      )}

      {records.length > 0 && (
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '4px 0 12px' }}>
          <FilterChip on={filter === 'all'} onClick={() => setFilter('all')}>전체</FilterChip>
          {CATEGORY_ORDER.map((k) => {
            const c = categoryOf(k)
            return (
              <FilterChip key={k} on={filter === k} onClick={() => setFilter(k)}>{c.name}</FilterChip>
            )
          })}
        </div>
      )}

      {records.length === 0 ? (
        <div style={{ ...card, marginTop: 6, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: C.inkSoft, marginBottom: 14 }}>
            아직 담긴 차가 없어요. 오늘 한 잔부터 시작해볼까요?
          </p>
          <button onClick={onGoToday} style={primaryBtn}>차 추천받기</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {shown.map((r) => {
            const tea = teaById(r.teaId)
            const cat = categoryOf(r.category)
            return (
              <article key={r.id} style={{ ...card, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: serif, fontSize: 15, fontWeight: 700 }}>
                      {tea ? tea.name : '알 수 없는 차'}
                    </div>
                    <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 2 }}>
                      {cat?.name} · {formatDate(r.createdAt)}
                    </div>
                  </div>
                  <CupRating category={r.category} value={r.rating} size={22} />
                </div>
                {r.tasteTags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                    {r.tasteTags.map((t) => <span key={t} style={chip}>{t}</span>)}
                  </div>
                )}
                {r.memo && (
                  <p style={{
                    fontSize: 13, color: C.ink, marginTop: 10,
                    overflowWrap: 'anywhere', wordBreak: 'break-word',
                  }}>
                    {r.memo}
                  </p>
                )}
                <button
                  onClick={() => onDelete(r.id)}
                  style={{ ...ghostBtn, marginTop: 10, color: C.inkSoft, fontSize: 12 }}
                >
                  삭제
                </button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

/* ── 차 도감 ── */
function GuideView({ onRecord }) {
  const [openCat, setOpenCat] = useState(null)
  const [detail, setDetail] = useState(null)

  if (detail) {
    const tea = detail
    const cat = categoryOf(tea.cat)
    return (
      <section>
        <button onClick={() => setDetail(null)} style={{ ...ghostBtn, marginBottom: 8 }}>← 목록</button>
        <Kicker>{cat?.name}</Kicker>
        <h2 style={h2}>{tea.name}</h2>
        <p style={{ fontSize: 14, color: C.ink, margin: '8px 0 14px' }}>{tea.taste}</p>
        <InfoRow label="우림" value={tea.brew} />
        <InfoRow label="카페인" value={caffeineLabel(tea.caffeine)} />
        <InfoRow label="바디" value={bodyLabel(tea.body)} />
        <button onClick={() => onRecord(tea)} style={{ ...primaryBtn, marginTop: 14 }}>이 차 기록하기</button>
        <Disclaimer />
      </section>
    )
  }

  if (openCat) {
    const cat = categoryOf(openCat)
    const teas = TEAS.filter((t) => t.cat === openCat)
    return (
      <section>
        <button onClick={() => setOpenCat(null)} style={{ ...ghostBtn, marginBottom: 8 }}>← 카테고리</button>
        <Kicker>{cat.vessel}</Kicker>
        <h2 style={h2}>{cat.name}</h2>
        <p style={{ fontSize: 13, color: C.inkSoft, margin: '6px 0 14px' }}>{cat.blurb}</p>
        <div style={{ display: 'grid', gap: 10 }}>
          {teas.map((t) => (
            <button key={t.id} onClick={() => setDetail(t)} style={{ ...card, textAlign: 'left' }}>
              <div style={{ fontFamily: serif, fontSize: 15, fontWeight: 700 }}>{t.name}</div>
              <p style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4 }}>{t.taste}</p>
            </button>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <Kicker>차 도감</Kicker>
      <h2 style={h2}>어디부터 볼까요?</h2>
      <div style={{ display: 'grid', gap: 10, marginTop: 6 }}>
        {CATEGORY_ORDER.map((k) => {
          const c = categoryOf(k)
          return (
            <button key={k} onClick={() => setOpenCat(k)} style={{ ...card, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
              <CupRating category={k} value={3} size={30} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: serif, fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{c.blurb}</div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

/* ── 기록 시트 ── */
function RecordSheet({ tea, user, onClose, onSave, onLogin }) {
  const [rating, setRating] = useState(3)
  const [tags, setTags] = useState([])
  const [memo, setMemo] = useState('')
  const [busy, setBusy] = useState(false)

  function toggleTag(t) {
    setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  }

  async function save() {
    setBusy(true)
    try {
      await onSave({
        id: newId(),
        teaId: tea.id,
        category: tea.cat,
        rating,
        tasteTags: tags,
        memo: memo.trim(),
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Overlay onClose={onClose} align="flex-end">
      <div style={{ width: '100%' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: C.line, margin: '0 auto 16px' }} />
        <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 700 }}>{tea.name}</div>
        <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 16 }}>{categoryOf(tea.cat)?.name}</div>

        <Label>몇 잔이었어요?</Label>
        <div style={{ marginBottom: 16 }}>
          <CupRating category={tea.cat} value={rating} onChange={setRating} size={34} />
        </div>

        <Label>맛은 어땠어요?</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {TASTE_TAGS.map((t) => (
            <button key={t} onClick={() => toggleTag(t)} style={tags.includes(t) ? chipOn : chipOff}>
              {t}
            </button>
          ))}
        </div>

        <Label>한 줄 남기기</Label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="오늘의 차, 한 줄로 남겨두자."
          rows={3}
          style={{
            width: '100%', padding: '11px 12px', fontSize: 14, lineHeight: 1.6,
            border: `1px solid ${C.line}`, borderRadius: 10, background: C.surface, color: C.ink,
            resize: 'none', marginBottom: 14,
          }}
        />

        {!user && (
          <p style={{ fontSize: 12, color: C.inkSoft, marginBottom: 12 }}>
            지금은 이 기기에만 저장돼요.{' '}
            <button onClick={onLogin} style={{ ...ghostBtn, display: 'inline', padding: 0, textDecoration: 'underline', color: C.amber }}>
              로그인
            </button>
            하면 계정에 옮겨드려요.
          </p>
        )}

        <button onClick={save} disabled={busy} style={primaryBtn}>
          {busy ? '담는 중…' : '찻장에 담기'}
        </button>
        <button onClick={onClose} style={{ ...ghostBtn, width: '100%', marginTop: 8 }}>닫기</button>
      </div>
    </Overlay>
  )
}

/* ── 공통 UI 조각 ── */
function Overlay({ children, onClose, align = 'center' }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(40,32,24,.38)', zIndex: 40,
        display: 'flex', alignItems: align, justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480, background: C.surface,
          borderRadius: align === 'flex-end' ? '20px 20px 0 0' : 16,
          padding: '22px 20px calc(22px + env(safe-area-inset-bottom))',
          margin: align === 'center' ? 18 : 0,
          boxShadow: '0 10px 40px rgba(40,32,24,.18)',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Kicker({ children }) {
  return (
    <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.inkSoft, margin: '4px 0 8px' }}>
      {children}
    </div>
  )
}
function Label({ children }) {
  return <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 8 }}>{children}</div>
}
function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '9px 0', borderTop: `1px solid ${C.line}` }}>
      <div style={{ width: 54, flex: 'none', fontSize: 12, color: C.inkSoft }}>{label}</div>
      <div style={{ fontSize: 13.5 }}>{value}</div>
    </div>
  )
}
function FilterChip({ on, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      flex: 'none', padding: '6px 12px', fontSize: 12.5, borderRadius: 999,
      border: `1px solid ${on ? C.ink : C.line}`,
      background: on ? C.ink : C.surface, color: on ? C.paper : C.inkSoft,
    }}>
      {children}
    </button>
  )
}
function Disclaimer() {
  return (
    <p style={{ fontSize: 11, color: C.inkSoft, marginTop: 18, lineHeight: 1.7 }}>{TASTE_DISCLAIMER}</p>
  )
}

/* ── 헬퍼 ── */
function formatDate(iso) {
  try {
    const d = new Date(iso)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  } catch {
    return ''
  }
}
function caffeineLabel(c) {
  return { none: '없음', low: '적음', mid: '보통', high: '높은 편' }[c] || '보통'
}
function bodyLabel(b) {
  return { light: '가벼움', medium: '중간', full: '묵직함' }[b] || '중간'
}

/* ── 스타일 상수 ── */
const h2 = { fontFamily: serif, fontSize: 21, fontWeight: 700, lineHeight: 1.35 }
const card = {
  background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16,
  padding: '16px', width: '100%',
}
const primaryBtn = {
  width: '100%', padding: '13px', fontSize: 14, border: 'none',
  borderRadius: 12, background: C.ink, color: C.paper,
}
const ghostBtn = {
  background: 'none', border: 'none', color: C.inkSoft, fontSize: 13,
  padding: '6px 4px',
}
const choiceBtn = {
  width: '100%', textAlign: 'left', padding: '14px 16px', fontSize: 15,
  border: `1px solid ${C.line}`, borderRadius: 13, background: C.surface, color: C.ink,
}
const chip = {
  fontSize: 11.5, color: C.inkSoft, background: C.paper,
  border: `1px solid ${C.line}`, borderRadius: 999, padding: '3px 9px',
}
const chipOff = {
  fontSize: 13, color: C.inkSoft, background: C.surface,
  border: `1px solid ${C.line}`, borderRadius: 999, padding: '7px 13px',
}
const chipOn = {
  fontSize: 13, color: C.paper, background: C.ink,
  border: `1px solid ${C.ink}`, borderRadius: 999, padding: '7px 13px',
}
