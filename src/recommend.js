import { TEAS } from './data/catalog.js'

// 추천 질문 정의 (UI에서 그대로 렌더)
export const QUESTIONS = [
  {
    id: 'taste',
    q: '오늘은 어떤 맛이 당겨요?',
    options: [
      { value: 'light',  label: '산뜻하고 가볍게' },
      { value: 'nutty',  label: '고소하고 구수하게' },
      { value: 'floral', label: '향긋하고 꽃 같은' },
      { value: 'deep',   label: '진하고 묵직하게' },
    ],
  },
  {
    id: 'caffeine',
    q: '카페인은 어떻게 할까요?',
    options: [
      { value: 'any',       label: '상관없어요' },
      { value: 'afternoon', label: '오후엔 피하고 싶어요' },
      { value: 'low',       label: '되도록 적게' },
    ],
  },
  {
    id: 'mood',
    q: '지금 원하는 건요?',
    options: [
      { value: 'wake',    label: '잠을 깨우고 싶어' },
      { value: 'relax',   label: '편안하게 쉬고 싶어' },
      { value: 'new',     label: '새로운 걸 마셔보고 싶어' },
      { value: 'focus',   label: '집중하고 싶어' },
    ],
  },
  {
    id: 'experience',
    q: '차, 얼마나 익숙해요?',
    options: [
      { value: 'first', label: '거의 처음이에요' },
      { value: 'some',  label: '몇 번 마셔봤어요' },
      { value: 'lover', label: '차를 좋아해요' },
    ],
  },
]

const TASTE_TO_FLAVORS = {
  light:  ['fresh', 'citrus', 'floral', 'grassy'],
  nutty:  ['nutty', 'roasty', 'malty'],
  floral: ['floral', 'fruity'],
  deep:   ['deep', 'earthy', 'smooth', 'malty'],
}

function has(tea, tag) {
  return tea.flavor.includes(tag)
}

// answers: { taste, caffeine, mood, experience }
// 반환: [{ tea, score, reasons: string[] }, ...]  점수 내림차순
export function recommend(answers) {
  const results = TEAS.map((tea) => {
    let score = 0
    const reasons = []

    // 1) 맛 취향
    const wanted = TASTE_TO_FLAVORS[answers.taste] || []
    const matched = tea.flavor.filter((f) => wanted.includes(f))
    if (matched.length) {
      score += matched.length * 2
      reasons.push('원하는 맛 결과 맞아요')
    }
    if (answers.taste === 'deep' && tea.body === 'full') score += 1

    // 2) 카페인
    if (answers.caffeine === 'afternoon') {
      if (tea.caffeine === 'high') score -= 3
      if (tea.caffeine === 'none' || tea.caffeine === 'low') {
        score += 1
        reasons.push('오후에도 부담 적어요')
      }
    } else if (answers.caffeine === 'low') {
      if (tea.caffeine === 'none') { score += 3; reasons.push('카페인이 없어요') }
      else if (tea.caffeine === 'low') { score += 2; reasons.push('카페인이 적어요') }
      else if (tea.caffeine === 'mid') score -= 1
      else if (tea.caffeine === 'high') score -= 3
    }

    // 3) 기분
    if (answers.mood === 'wake') {
      if (tea.caffeine === 'high') { score += 2; reasons.push('잠을 깨우기 좋아요') }
      if (has(tea, 'fresh')) score += 1
    } else if (answers.mood === 'relax') {
      if (tea.caffeine === 'none' || tea.caffeine === 'low') score += 2
      if (has(tea, 'floral') || has(tea, 'smooth')) { score += 1; reasons.push('편안하게 쉬기 좋아요') }
    } else if (answers.mood === 'new') {
      if (tea.difficulty >= 2) { score += 2; reasons.push('색다른 경험이에요') }
      if (has(tea, 'fruity') || has(tea, 'floral')) score += 1
    } else if (answers.mood === 'focus') {
      if (tea.caffeine === 'mid') score += 1
      if (has(tea, 'deep')) { score += 1; reasons.push('집중할 때 어울려요') }
    }

    // 4) 경험 수준
    if (answers.experience === 'first') {
      if (tea.difficulty === 1) { score += 3; reasons.push('처음 마시기 편해요') }
      if (tea.difficulty === 3) score -= 2
    } else if (answers.experience === 'some') {
      if (tea.difficulty <= 2) score += 1
    } else if (answers.experience === 'lover') {
      if (tea.difficulty === 3) { score += 1; reasons.push('취향을 넓혀줄 차예요') }
    }

    return { tea, score, reasons: dedupe(reasons) }
  })

  // 점수 내림차순, 동점이면 초보 친화(난이도 낮은 것) 우선
  results.sort((a, b) => b.score - a.score || a.tea.difficulty - b.tea.difficulty)
  return results
}

export function topPicks(answers, n = 3) {
  return recommend(answers)
    .filter((r) => r.score > 0)
    .slice(0, n)
}

function dedupe(arr) {
  return Array.from(new Set(arr))
}
