import { useEffect, useRef, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, firebaseReady } from './firebase.js'
import { QUESTIONS, topPicks } from './recommend.js'
import {
  CATEGORY_ORDER, TEAS, teaById, categoryOf, TASTE_DISCLAIMER,
} from './data/catalog.js'
import {
  STORY, MILESTONES, TEAWARE, TEAWARE_INTRO, TEAWARE_SAFE,
} from './data/story.js'
import {
  loadRecords, saveRecord, deleteRecord, mergeAnonIntoUser, newId,
} from './storage.js'
import { CAT_COLOR } from './styles.js'
import Art from './components/Art.jsx'
import CupRating from './components/CupRating.jsx'
import AuthPanel from './components/AuthPanel.jsx'
import LogoutSheet from './components/LogoutSheet.jsx'

const TASTE_TAGS = ['산뜻', '고소', '꽃향', '과일향', '진함', '부드러움', '떫음', '달큰']
const SEEN_KEY = 'pickteaup:onboarded'
function hasSeenStory() {
  try { return Boolean(window.localStorage.getItem(SEEN_KEY)) } catch { return false }
}

export default function App() {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [records, setRecords] = useState([])
  const [tab, setTab] = useState('today')
  const [onboarding, setOnboarding] = useState(() => {
    try { return !window.localStorage.getItem(SEEN_KEY) } catch { return true }
  })
  const [recordFor, setRecordFor] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [milestone, setMilestone] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null)
      setAuthReady(true)
      if (u) { try { await mergeAnonIntoUser(u.uid) } catch { /* noop */ } }
      setRecords(await loadRecords(u ? u.uid : null))
    })
    return unsub
  }, [])

  function finishOnboarding() {
    try { window.localStorage.setItem(SEEN_KEY, '1') } catch { /* noop */ }
    setOnboarding(false)
  }

  async function handleSave(rec) {
    await saveRecord(user ? user.uid : null, rec)
    const next = await loadRecords(user ? user.uid : null)
    setRecords(next)
    setRecordFor(null)
    const hit = MILESTONES.find((m) => m.count === next.length)
    if (hit) setMilestone(hit)
    else setTab('archive')
  }

  async function handleDelete(id) {
    await deleteRecord(user ? user.uid : null, id)
    setRecords(await loadRecords(user ? user.uid : null))
  }

  async function doLogout() {
    setLogoutOpen(false)
    try { await signOut(auth) } catch { /* noop */ }
    setRecords(await loadRecords(null))
  }

  if (onboarding) return <Onboarding onDone={finishOnboarding} revisit={hasSeenStory()} />

  return (
    <div className="app">
      <header className="hdr">
        <button className="brand" onClick={() => setTab('today')} aria-label="홈으로">
          <BrandMark />
          <span className="logotype">픽티업<span className="with">with 핑티</span></span>
        </button>
        {user ? (
          <button className="ghost" onClick={() => setLogoutOpen(true)}>
            {user.email ? user.email.split('@')[0] : '내 계정'}
          </button>
        ) : (
          <button className="ghost u" onClick={() => setAuthOpen(true)}>로그인</button>
        )}
      </header>

      {!firebaseReady && (
        <div className="pad" style={{ marginBottom: 10 }}>
          <div className="banner">
            Firebase 설정이 비어 있어요. 지금은 이 기기에만 임시로 저장돼요.
          </div>
        </div>
      )}

      <nav className="tabs">
        {[
          { k: 'today', label: '오늘 마실 차' },
          { k: 'archive', label: '내 찻장' },
          { k: 'guide', label: '차 도감' },
        ].map((t) => (
          <button
            key={t.k}
            className={`tab ${tab === t.k ? 'on' : ''}`}
            onClick={() => setTab(t.k)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="pad" style={{ paddingTop: 18 }}>
        {tab === 'today' && <TodayView onRecord={setRecordFor} />}
        {tab === 'archive' && (
          <ArchiveView
            records={records} user={user} authReady={authReady}
            onDelete={handleDelete}
            onLogin={() => setAuthOpen(true)}
            onGoToday={() => setTab('today')}
          />
        )}
        {tab === 'guide' && <GuideView onRecord={setRecordFor} />}

        <div style={{ marginTop: 34, display: 'flex', justifyContent: 'center', gap: 18 }}>
          <button className="ghost u" onClick={() => setOnboarding(true)}>핑티 이야기 다시 보기</button>
          <button className="ghost u" onClick={() => setAboutOpen(true)}>by EMMA</button>
        </div>
      </main>

      {recordFor && (
        <RecordSheet
          tea={recordFor} user={user}
          onClose={() => setRecordFor(null)}
          onSave={handleSave}
          onLogin={() => setAuthOpen(true)}
        />
      )}

      {authOpen && (
        <Overlay onClose={() => setAuthOpen(false)} align="center">
          <AuthPanel
            title="로그인하고 계속하기"
            note="기록을 계정에 저장하면, 어느 기기에서든 이어서 볼 수 있어요."
          />
        </Overlay>
      )}

      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}

      {milestone && (
        <MilestoneModal
          data={milestone}
          onClose={() => { setMilestone(null); setTab('archive') }}
        />
      )}

      <LogoutSheet open={logoutOpen} onConfirm={doLogout} onCancel={() => setLogoutOpen(false)} />
    </div>
  )
}

/* ── 온보딩 (스와이프 지원, 40px 임계값) ───────────── */
function Onboarding({ onDone, revisit = false }) {
  const [i, setI] = useState(0)
  const startX = useRef(null)
  const last = i === STORY.length - 1
  const s = STORY[i]

  function go(d) {
    setI((v) => Math.min(STORY.length - 1, Math.max(0, v + d)))
  }
  function onStart(e) { startX.current = e.touches[0].clientX }
  function onEnd(e) {
    if (startX.current == null) return
    const dx = e.changedTouches[0].clientX - startX.current
    if (dx < -40) go(1)
    else if (dx > 40) go(-1)
    startX.current = null
  }

  return (
    <div className="app">
      <header className="hdr">
        <div className="brand">
          <BrandMark />
          <span className="logotype">픽티업<span className="with">with 핑티</span></span>
        </div>
        <button className="ghost" onClick={onDone}>건너뛰기</button>
      </header>

      <div className="pad" style={{ paddingTop: 8 }}>
        <div className="story" onTouchStart={onStart} onTouchEnd={onEnd}>
          <Art name={s.art} alt="" note={`핑티 일러스트\n${s.art}.jpg`} />
          <div className="story-body">
            <div className="kicker">{s.kicker}</div>
            <div className="h1" style={{ marginBottom: 10 }}>{s.title}</div>
            <p className="body wrap-safe">{s.body}</p>
          </div>
        </div>

        <div className="dots">
          {STORY.map((_, n) => (
            <button
              key={n}
              className={`dot ${n === i ? 'on' : ''}`}
              aria-label={`${n + 1}번째 장면`}
              onClick={() => setI(n)}
            />
          ))}
        </div>

        <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
          <button className="btn" onClick={() => (last ? onDone() : go(1))}>
            {last ? (revisit ? '차 마시러 가기' : '차 골라줘 ✦') : '다음'}
          </button>
          {i > 0 && <button className="ghost" onClick={() => go(-1)}>이전</button>}
        </div>
      </div>
    </div>
  )
}

/* ── 오늘 마실 차 ───────────────────────────── */
function TodayView({ onRecord }) {
  const [answers, setAnswers] = useState({})
  const done = QUESTIONS.every((q) => answers[q.id])

  if (!done) {
    const q = QUESTIONS.find((x) => !answers[x.id])
    const idx = QUESTIONS.indexOf(q)
    return (
      <section>
        <div className="kicker">추천 · {idx + 1} / {QUESTIONS.length}</div>
        <h2 className="h1" style={{ marginBottom: 14 }}>{q.q}</h2>
        <div className="choice-list">
          {q.options.map((o) => (
            <button
              key={o.value}
              className="choice"
              onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.value }))}
            >
              {o.label}
            </button>
          ))}
        </div>
        {idx > 0 && (
          <button className="ghost u" style={{ marginTop: 16 }} onClick={() => setAnswers({})}>
            처음부터 다시
          </button>
        )}
      </section>
    )
  }

  const picks = topPicks(answers, 3)
  return (
    <section>
      <div className="kicker"><span className="spark">✦</span> 오늘의 추천</div>
      <h2 className="h1" style={{ marginBottom: 14 }}>이런 차는 어때요?</h2>

      {picks.length === 0 && (
        <p className="muted">딱 맞는 차를 못 찾았어요. 조건을 바꿔볼까요?</p>
      )}

      {picks.map(({ tea, reasons }) => {
        const cat = categoryOf(tea.cat)
        return (
          <article className="card" key={tea.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
              <div className="h2">{tea.name}</div>
              <div className="tiny" style={{ flex: 'none' }}>{cat?.name}</div>
            </div>
            <p className="body wrap-safe" style={{ margin: '7px 0 10px' }}>{tea.taste}</p>
            {reasons.length > 0 && (
              <div className="chip-row" style={{ marginBottom: 11 }}>
                {reasons.map((r) => <span className="tag" key={r}>{r}</span>)}
              </div>
            )}
            <div className="tiny" style={{ marginBottom: 6 }}>우림 · {tea.brew}</div>
            <div className="tiny" style={{ marginBottom: 13 }}>다구 · {cat?.teaware}</div>
            <button className="btn" onClick={() => onRecord(tea)}>이 차 기록하기</button>
          </article>
        )
      })}

      <button className="ghost u" style={{ marginTop: 16 }} onClick={() => setAnswers({})}>
        다시 골라보기
      </button>
      <p className="tiny" style={{ marginTop: 16 }}>{TASTE_DISCLAIMER}</p>
    </section>
  )
}

/* ── 내 찻장 ───────────────────────────────── */
function ArchiveView({ records, user, authReady, onDelete, onLogin, onGoToday }) {
  const [filter, setFilter] = useState('all')
  const shown = filter === 'all' ? records : records.filter((r) => r.category === filter)

  return (
    <section>
      <div className="kicker">내 찻장</div>
      <h2 className="h1" style={{ marginBottom: 14 }}>마신 차, {records.length}잔</h2>

      {!user && authReady && (
        <div className="card" style={{ marginBottom: 12 }}>
          <p className="body" style={{ marginBottom: 12 }}>
            지금 기록은 이 기기에만 있어요. 로그인하면 계정으로 옮겨드리고,
            다른 기기에서도 이어서 볼 수 있어요.
          </p>
          <button className="btn" onClick={onLogin}>로그인하고 계정에 저장</button>
        </div>
      )}

      {records.length >= 3 && <TasteMap records={records} />}

      {records.length > 0 && (
        <div className="chip-scroll">
          <button className={`chip ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>전체</button>
          {CATEGORY_ORDER.map((k) => (
            <button
              key={k}
              className={`chip ${filter === k ? 'on' : ''}`}
              onClick={() => setFilter(k)}
            >
              {categoryOf(k).name}
            </button>
          ))}
        </div>
      )}

      {records.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="muted" style={{ marginBottom: 14 }}>
            아직 담긴 차가 없어요. 오늘 한 잔부터 시작해볼까요?
          </p>
          <button className="btn" onClick={onGoToday}>차 골라줘</button>
        </div>
      ) : (
        shown.map((r) => {
          const tea = teaById(r.teaId)
          const cat = categoryOf(r.category)
          return (
            <article className="card" key={r.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <div className="wrap-safe">
                  <div className="h3">{tea ? tea.name : '알 수 없는 차'}</div>
                  <div className="tiny">{cat?.name} · {fmt(r.createdAt)}</div>
                </div>
                <CupRating category={r.category} value={r.rating} size={22} />
              </div>
              {r.tasteTags?.length > 0 && (
                <div className="chip-row" style={{ marginTop: 10 }}>
                  {r.tasteTags.map((t) => <span className="tag" key={t}>{t}</span>)}
                </div>
              )}
              {r.memo && <p className="body wrap-safe" style={{ marginTop: 10 }}>{r.memo}</p>}
              <button className="ghost" style={{ marginTop: 8 }} onClick={() => onDelete(r.id)}>
                삭제
              </button>
            </article>
          )
        })
      )}
    </section>
  )
}

/* ── 취향 지도 — 맛 태그 빈도 시각화 ── */
function TasteMap({ records }) {
  const counts = {}
  records.forEach((r) => (r.tasteTags || []).forEach((t) => { counts[t] = (counts[t] || 0) + 1 }))
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  if (top.length === 0) return null
  const max = top[0][1]
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="kicker"><span className="spark">✦</span> 내 취향 지도</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
        {top.map(([tag, n]) => (
          <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, width: 44, flex: 'none', color: 'var(--umber)' }}>{tag}</span>
            <div style={{ flex: 1, height: 14, borderRadius: 99, background: 'rgba(228,221,206,.5)', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.round((n / max) * 100)}%`, height: '100%',
                borderRadius: 99, minWidth: 18,
                background: 'linear-gradient(180deg,#B9C4AD,#97A589)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4)',
                transition: 'width .5s cubic-bezier(.3,1,.4,1)',
              }} />
            </div>
            <span className="tiny" style={{ width: 26, textAlign: 'right', flex: 'none' }}>{n}잔</span>
          </div>
        ))}
      </div>
      <p className="tiny" style={{ marginTop: 10 }}>자주 고른 맛일수록 길어져요. 취향은 이렇게 쌓여.</p>
    </div>
  )
}

/* ── 차 도감 ───────────────────────────────── */
function GuideView({ onRecord }) {
  const [openCat, setOpenCat] = useState(null)
  const [detail, setDetail] = useState(null)

  if (detail) {
    const cat = categoryOf(detail.cat)
    return (
      <section>
        <button className="ghost u" onClick={() => setDetail(null)}>← 목록</button>
        <div className="kicker" style={{ marginTop: 8 }}>{cat?.name}</div>
        <h2 className="h1" style={{ marginBottom: 10 }}>{detail.name}</h2>
        <p className="body wrap-safe" style={{ marginBottom: 14 }}>{detail.taste}</p>
        <Row k="우림" v={detail.brew} />
        <Row k="다구" v={cat?.teaware} />
        <Row k="카페인" v={caff(detail.caffeine)} />
        <Row k="바디" v={body(detail.body)} />
        <button className="btn" style={{ marginTop: 16 }} onClick={() => onRecord(detail)}>
          이 차 기록하기
        </button>
        <p className="tiny" style={{ marginTop: 16 }}>{TASTE_DISCLAIMER}</p>
      </section>
    )
  }

  if (openCat) {
    const cat = categoryOf(openCat)
    return (
      <section>
        <button className="ghost u" onClick={() => setOpenCat(null)}>← 카테고리</button>
        <div className="kicker" style={{ marginTop: 8 }}>{cat.vessel}</div>
        <h2 className="h1">{cat.name}</h2>
        <p className="muted" style={{ margin: '6px 0 14px' }}>{cat.blurb}</p>
        {TEAS.filter((t) => t.cat === openCat).map((t) => (
          <button className="card" style={{ textAlign: 'left' }} key={t.id} onClick={() => setDetail(t)}>
            <div className="h3">{t.name}</div>
            <p className="muted wrap-safe" style={{ marginTop: 4 }}>{t.taste}</p>
          </button>
        ))}
      </section>
    )
  }

  return (
    <section>
      <div className="kicker">차 도감</div>
      <h2 className="h1" style={{ marginBottom: 14 }}>어디부터 볼까요?</h2>

      <div style={{ display: 'grid', gap: 11 }}>
        {CATEGORY_ORDER.map((k) => {
          const c = categoryOf(k)
          return (
            <button className="cover" key={k} onClick={() => setOpenCat(k)}>
              <Art name={c.art} className="cover-art" alt="" note={`커버 일러스트\n${c.art}.jpg`} />
              <div className="cover-body">
                <div className="cover-mood" style={{ color: c.mood }}>{c.moodWord}</div>
                <div className="h2">{c.name}</div>
                <div className="muted" style={{ marginTop: 3 }}>{c.blurb}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* 다구, 이것부터 — C1 온보딩의 감정 회수 지점 */}
      <div style={{ marginTop: 30 }}>
        <div className="kicker">다구, 이것부터</div>
        <p className="body wrap-safe" style={{ marginBottom: 13 }}>{TEAWARE_INTRO}</p>
        {TEAWARE.map((t) => (
          <div className="card" key={t.id} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
            <img
              src={`${import.meta.env.BASE_URL}illustrations/${t.art}.jpg`}
              alt="" width={72} height={72} loading="lazy"
              style={{ borderRadius: 16, flex: 'none', objectFit: 'cover' }}
            />
            <div className="wrap-safe" style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <div className="h3">{t.name}</div>
                <div className="tiny">{t.sub}</div>
              </div>
              <p className="body wrap-safe" style={{ marginTop: 5 }}>{t.body}</p>
            </div>
          </div>
        ))}
        <p className="tiny" style={{ marginTop: 14 }}>{TEAWARE_SAFE}</p>
      </div>
    </section>
  )
}

/* ── 기록 시트 ───────────────────────────── */
function RecordSheet({ tea, user, onClose, onSave, onLogin }) {
  const [rating, setRating] = useState(3)
  const [tags, setTags] = useState([])
  const [memo, setMemo] = useState('')
  const [busy, setBusy] = useState(false)

  async function save() {
    setBusy(true)
    try {
      await onSave({
        id: newId(), teaId: tea.id, category: tea.cat,
        rating, tasteTags: tags, memo: memo.trim(),
      })
    } finally { setBusy(false) }
  }

  return (
    <Overlay onClose={onClose} align="bottom">
      <div className="grip" />
      <div className="h2">{tea.name}</div>
      <div className="tiny" style={{ marginBottom: 18 }}>{categoryOf(tea.cat)?.name}</div>

      <div className="qlabel">오늘, 이 차 어땠어?</div>
      <div style={{ marginBottom: 18 }}>
        <CupRating category={tea.cat} value={rating} onChange={setRating} size={34} />
      </div>

      <div className="qlabel">맛은 어땠어?</div>
      <div className="chip-row" style={{ marginBottom: 18 }}>
        {TASTE_TAGS.map((t) => (
          <button
            key={t}
            className={`chip ${tags.includes(t) ? 'on' : ''}`}
            onClick={() => setTags((c) => (c.includes(t) ? c.filter((x) => x !== t) : [...c, t]))}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="qlabel">한 줄 남기기</div>
      <textarea
        className="field ruled"
        rows={3}
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="오늘의 차, 한 줄로 남겨두자."
        style={{ marginBottom: 14 }}
      />

      {!user && (
        <p className="tiny" style={{ marginBottom: 12 }}>
          지금은 이 기기에만 저장돼요.{' '}
          <button className="ghost u" style={{ display: 'inline', padding: 0, color: 'var(--camel)' }} onClick={onLogin}>
            로그인
          </button>
          하면 계정에 옮겨드려요.
        </p>
      )}

      <button className="btn" onClick={save} disabled={busy}>
        {busy ? '담는 중…' : '찻장에 담기'}
      </button>
      <button className="ghost" style={{ width: '100%', marginTop: 8 }} onClick={onClose}>닫기</button>
    </Overlay>
  )
}

/* ── by EMMA ── */
function AboutModal({ onClose }) {
  return (
    <Overlay onClose={onClose} align="center">
      <div style={{ textAlign: 'center' }}>
        <img
          src={`${import.meta.env.BASE_URL}illustrations/about-pingti.jpg`}
          alt="" width={96} height={96}
          style={{ borderRadius: 24, display: 'block', margin: '0 auto 12px' }}
        />
        <div className="kicker" style={{ textAlign: 'center' }}>by EMMA</div>
        <p className="body wrap-safe" style={{ margin: '10px 0 6px' }}>
          차가 어렵게 느껴지는 사람들을 위해 만들었어요.
        </p>
        <p className="muted wrap-safe" style={{ marginBottom: 20 }}>
          핑티가 대신 물어봐 주고, 마신 잔은 찻장에 남아요.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
          <a className="about-link" href="mailto:emma.neway@gmail.com" aria-label="이메일 보내기">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
              <path d="M3.6 7 12 12.8 20.4 7" />
            </svg>
          </a>
          <a className="about-link" href="https://instagram.com/emma.neway"
            target="_blank" rel="noopener noreferrer" aria-label="인스타그램 열기">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="1.05" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
        <button className="ghost" style={{ width: '100%', marginTop: 16 }} onClick={onClose}>닫기</button>
      </div>
    </Overlay>
  )
}

/* ── 마일스톤 ───────────────────────────── */
function MilestoneModal({ data, onClose }) {
  return (
    <Overlay onClose={onClose} align="center">
      <div style={{ margin: '-22px -20px 16px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
        <Art name={data.art} alt="" note={`핑티 일러스트\n${data.art}.jpg`} />
      </div>
      <div className="kicker"><span className="spark">✦</span> {data.count}잔째</div>
      <div className="h2" style={{ marginBottom: 8 }}>{data.title}</div>
      <p className="body wrap-safe" style={{ marginBottom: 18 }}>{data.body}</p>
      <button className="btn" onClick={onClose}>찻장 보기</button>
    </Overlay>
  )
}

/* ── 공통 조각 ───────────────────────────── */
function Overlay({ children, onClose, align = 'center' }) {
  useEffect(() => {
    function esc(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  return (
    <div className={`ovl ${align}`} onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="row">
      <div className="row-k">{k}</div>
      <div className="row-v">{v}</div>
    </div>
  )
}

function BrandMark({ size = 34 }) {
  return (
    <img className="brand-mark" width={size} height={size} alt=""
      src={`${import.meta.env.BASE_URL}illustrations/logo-line.png`} />
  )
}

/* ── 헬퍼 ───────────────────────────────── */
function fmt(iso) {
  try {
    const d = new Date(iso)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  } catch { return '' }
}
function caff(c) { return { none: '없음', low: '적음', mid: '보통', high: '높은 편' }[c] || '보통' }
function body(b) { return { light: '가벼움', medium: '중간', full: '묵직함' }[b] || '중간' }
