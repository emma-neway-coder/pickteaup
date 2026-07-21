import { db } from './firebase.js'
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'

// ────────────────────────────────────────────────────────────
// 픽티업 기록 저장소
// 반틈에서 검증된 원칙을 이식:
//  1) 사용자별로 완전히 분리 저장 (users/{uid}/records/{id})
//  2) uid로 네임스페이스한 localStorage 캐시 (오프라인/빠른 표시)
//  3) localStorage조차 못 쓰면 메모리 폴백
//  4) 로그인 시 익명(anon) 기록을 사용자 계정으로 병합 — 같은 id는 updatedAt이 최신인 쪽 유지
//
// record: { id, teaId, category, rating(1~5), tasteTags[], memo, createdAt, updatedAt }
// ────────────────────────────────────────────────────────────

const memoryStore = new Map() // key -> records[]  (최후 폴백)

function localKey(uid) {
  return `pickteaup:${uid || 'anon'}:records`
}

function canUseLocalStorage() {
  try {
    const k = '__pk_test__'
    window.localStorage.setItem(k, '1')
    window.localStorage.removeItem(k)
    return true
  } catch {
    return false
  }
}

function readCache(uid) {
  const key = localKey(uid)
  if (canUseLocalStorage()) {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : []
    } catch {
      /* fall through to memory */
    }
  }
  return memoryStore.get(key) || []
}

function writeCache(uid, records) {
  const key = localKey(uid)
  memoryStore.set(key, records)
  if (canUseLocalStorage()) {
    try {
      window.localStorage.setItem(key, JSON.stringify(records))
    } catch {
      /* memory already holds it */
    }
  }
}

function upsert(records, record) {
  const next = records.filter((r) => r.id !== record.id)
  next.push(record)
  next.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return next
}

// ── 읽기 ──────────────────────────────────────────────
// 로그인 상태면 Firestore를 소스로 쓰되, 실패하면 캐시로 폴백.
export async function loadRecords(uid) {
  if (!uid) return readCache(null)

  try {
    const snap = await getDocs(collection(db, 'users', uid, 'records'))
    const remote = snap.docs.map((d) => d.data())
    remote.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    writeCache(uid, remote) // 캐시 갱신
    return remote
  } catch (e) {
    console.warn('[storage] Firestore 읽기 실패, 캐시로 폴백:', e)
    return readCache(uid)
  }
}

// ── 저장 ──────────────────────────────────────────────
// 캐시를 먼저 갱신(즉시 반영)하고, 로그인 상태면 Firestore에도 기록.
export async function saveRecord(uid, record) {
  const now = new Date().toISOString()
  const full = {
    tasteTags: [],
    memo: '',
    ...record,
    createdAt: record.createdAt || now,
    updatedAt: now,
  }

  writeCache(uid, upsert(readCache(uid), full))

  if (uid) {
    try {
      await setDoc(doc(db, 'users', uid, 'records', full.id), full)
    } catch (e) {
      console.warn('[storage] Firestore 저장 실패(캐시엔 남아있음):', e)
      // 캐시에는 있으므로 다음 loadRecords 병합 때 재시도 여지를 남김
      throw e
    }
  }
  return full
}

// ── 삭제 ──────────────────────────────────────────────
export async function deleteRecord(uid, id) {
  writeCache(uid, readCache(uid).filter((r) => r.id !== id))
  if (uid) {
    try {
      await deleteDoc(doc(db, 'users', uid, 'records', id))
    } catch (e) {
      console.warn('[storage] Firestore 삭제 실패:', e)
      throw e
    }
  }
}

// ── 로그인 시 익명 기록 병합 ─────────────────────────────
// anon 캐시에 쌓인 기록을 사용자 계정으로 옮김.
// 같은 id가 있으면 updatedAt이 더 최신인 쪽을 남김(타임스탬프 우선).
export async function mergeAnonIntoUser(uid) {
  if (!uid) return
  const anon = readCache(null)
  if (!anon.length) return

  let remote = []
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'records'))
    remote = snap.docs.map((d) => d.data())
  } catch (e) {
    console.warn('[storage] 병합용 원격 읽기 실패:', e)
    return // 원격을 못 읽으면 anon은 지우지 않고 보존
  }

  const remoteById = new Map(remote.map((r) => [r.id, r]))
  const toWrite = []
  for (const a of anon) {
    const ex = remoteById.get(a.id)
    if (!ex || (a.updatedAt || '') > (ex.updatedAt || '')) {
      toWrite.push(a)
    }
  }

  try {
    for (const r of toWrite) {
      await setDoc(doc(db, 'users', uid, 'records', r.id), r)
    }
    // 병합 성공 시에만 anon 캐시 비움
    writeCache(null, [])
  } catch (e) {
    console.warn('[storage] 병합 쓰기 실패, anon 보존:', e)
  }
}

export function newId() {
  return 'rec_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7)
}
