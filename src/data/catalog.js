// 픽티업 차 카탈로그
// caffeine: 'none' | 'low' | 'mid' | 'high'  (실제 함량은 잎·우림·개인차로 달라 대략적 밴드로만 표기)
// body: 'light' | 'medium' | 'full'
// difficulty: 1(초보 친화) ~ 3(경험자)
// flavor: 추천 매칭용 태그
//   fresh 산뜻 · grassy 풋풋 · umami 감칠 · nutty 고소 · roasty 볶은 ·
//   floral 꽃향 · fruity 과일향 · citrus 시트러스 · malty 몰티 · sweet 단 ·
//   deep 진함 · earthy 흙내음 · smooth 부드러움

export const CATEGORIES = [
  {
    key: 'green', name: '녹차', vessel: '얕은 사발', art: 't1-green',
    mood: '#6F8250', moodWord: 'Fresh',
    blurb: '맑고 서늘한 첫 페이지.',
    teaware: '넓고 얕은 사발에, 잎이 도는 걸 보며',
  },
  {
    key: 'oolong', name: '청차 · 우롱차', vessel: '작은 잔', art: 't2-oolong',
    mood: '#A9793C', moodWord: 'Floral',
    blurb: '가벼움과 묵직함 사이, 발효도의 스펙트럼.',
    teaware: '개완을 열어 향을 먼저',
  },
  {
    key: 'puer', name: '보이차', vessel: '자사호 잔', art: 't3-puer',
    mood: '#7A4A2F', moodWord: 'Deep',
    blurb: '시간이 쌓여 부드러워진 것.',
    teaware: '두툼한 자사호로 진하게',
  },
  {
    key: 'black', name: '홍차', vessel: '유럽식 잔', art: 't5-black',
    mood: '#9A5333', moodWord: 'Malty',
    blurb: '붉게 우러나는, 가장 익숙한 입구.',
    teaware: '손잡이 잔에 받침까지, 우유도 곁들여',
  },
  {
    key: 'flower', name: '꽃차', vessel: '유리 다관', art: 't4-flower',
    mood: '#B0705E', moodWord: 'Blooming',
    blurb: '처음 보는 것이 우러나는 순간.',
    teaware: '유리 다관에, 피어나는 모습까지',
  },
]

export const CATEGORY_ORDER = ['green', 'oolong', 'puer', 'black', 'flower']

export const TEAS = [
  // ── 녹차 ──
  {
    id: 'g-woojeon', cat: 'green', name: '하동 우전',
    caffeine: 'mid', body: 'light', difficulty: 1,
    flavor: ['fresh', 'umami', 'floral'],
    taste: '이른 봄 첫 잎으로, 여린 감칠맛과 은은한 꽃향.',
    brew: '70℃ 안팎으로 낮게, 1~2분. 뜨거우면 쓴맛이 올라와요.',
  },
  {
    id: 'g-sejak', cat: 'green', name: '보성 세작',
    caffeine: 'mid', body: 'light', difficulty: 1,
    flavor: ['fresh', 'grassy', 'umami'],
    taste: '풋풋하고 산뜻한, 초록의 인상.',
    brew: '75℃, 1~2분.',
  },
  {
    id: 'g-hyeonmi', cat: 'green', name: '현미녹차',
    caffeine: 'low', body: 'light', difficulty: 1,
    flavor: ['nutty', 'roasty', 'sweet'],
    taste: '볶은 현미의 고소함이 녹차의 풋풋함을 감싸요.',
    brew: '80℃, 1~2분. 부담 없이 자주.',
  },

  // ── 청차 · 우롱차 ──
  {
    id: 'o-tieguanyin', cat: 'oolong', name: '철관음',
    caffeine: 'mid', body: 'medium', difficulty: 1,
    flavor: ['floral', 'fresh', 'sweet'],
    taste: '난꽃 같은 향과 맑은 단맛. 가벼운 우롱의 대표.',
    brew: '90~95℃로 여러 번 짧게 우려요.',
  },
  {
    id: 'o-dahongpao', cat: 'oolong', name: '대홍포',
    caffeine: 'mid', body: 'full', difficulty: 2,
    flavor: ['roasty', 'deep', 'nutty'],
    taste: '불에 볶은 깊은 향(암운). 진하고 묵직한 우롱.',
    brew: '95℃로 짧게 여러 번.',
  },
  {
    id: 'o-oriental', cat: 'oolong', name: '동방미인',
    caffeine: 'mid', body: 'medium', difficulty: 2,
    flavor: ['fruity', 'sweet', 'floral'],
    taste: '잘 익은 과일과 꿀 같은 단향. 산화도가 높은 우롱.',
    brew: '85~90℃, 짧게.',
  },

  // ── 보이차 ──
  {
    id: 'p-shou', cat: 'puer', name: '숙차 (익힘)',
    caffeine: 'mid', body: 'full', difficulty: 2,
    flavor: ['earthy', 'deep', 'smooth', 'sweet'],
    taste: '흙내음과 부드러운 단맛. 처음 만나는 보이차로 무난해요.',
    brew: '95~100℃, 첫 물은 헹궈 버리고 짧게 여러 번.',
  },
  {
    id: 'p-sheng', cat: 'puer', name: '생차 (날것)',
    caffeine: 'high', body: 'full', difficulty: 3,
    flavor: ['deep', 'fruity', 'smooth'],
    taste: '쌉쌀함 뒤에 단맛이 돌아오는 회감(回甘). 세월이 만드는 차.',
    brew: '95℃, 짧게. 오래 우리면 강해져요.',
  },

  // ── 홍차 (4종) ──
  {
    id: 'b-earlgrey', cat: 'black', name: '얼그레이',
    caffeine: 'mid', body: 'medium', difficulty: 1,
    flavor: ['citrus', 'floral', 'fresh'],
    taste: '베르가모트의 시트러스·플로럴 향. "이름은 아는데" 하던 그 첫 잔.',
    brew: '95℃, 3분 안팎. 우유·설탕 없이도 향으로 즐겨요.',
  },
  {
    id: 'b-assam', cat: 'black', name: '아쌈',
    caffeine: 'high', body: 'full', difficulty: 1,
    flavor: ['malty', 'sweet', 'deep'],
    taste: '설탕 없이도 단맛이 도는 몰티(malty)함. 밀크티로 익숙해진 맛.',
    brew: '95℃, 3~4분. 우유와 특히 잘 맞아요.',
  },
  {
    id: 'b-darjeeling', cat: 'black', name: '다르질링',
    caffeine: 'mid', body: 'medium', difficulty: 2,
    flavor: ['fruity', 'floral', 'fresh'],
    taste: '머스캣 포도를 닮은 향. "홍차도 향으로 마신다"를 알려주는 차.',
    brew: '90~95℃, 3분. 스트레이트로 향을 즐겨요.',
  },
  {
    id: 'b-english', cat: 'black', name: '잉글리시 브렉퍼스트',
    caffeine: 'high', body: 'full', difficulty: 1,
    flavor: ['malty', 'deep', 'roasty'],
    taste: '진하고 묵직한 아침용 배합. 우유·아침 식사와 잘 어울려요.',
    brew: '95℃, 3~4분.',
  },

  // ── 꽃차 ──
  {
    id: 'f-chrysanth', cat: 'flower', name: '국화차',
    caffeine: 'none', body: 'light', difficulty: 1,
    flavor: ['floral', 'fresh', 'sweet'],
    taste: '맑고 은은한 꽃향. 카페인이 없어 밤에도 편해요.',
    brew: '90℃, 유리 다관에 3~4분. 피어나는 모습을 함께.',
  },
  {
    id: 'f-rose', cat: 'flower', name: '장미차',
    caffeine: 'none', body: 'light', difficulty: 1,
    flavor: ['floral', 'fruity', 'sweet'],
    taste: '달큰하고 화사한 장미 향.',
    brew: '90℃, 3분.',
  },
  {
    id: 'f-plum', cat: 'flower', name: '매화차',
    caffeine: 'none', body: 'light', difficulty: 2,
    flavor: ['floral', 'fresh'],
    taste: '이른 봄의 섬세한 매화 향. 향이 여려 조용히 즐기는 차.',
    brew: '85~90℃, 짧게.',
  },
]

export const TASTE_DISCLAIMER =
  '맛과 카페인은 잎·산지·우림·개인차에 따라 달라져요. 여기 표현은 참고용이에요.'

export function teaById(id) {
  return TEAS.find((t) => t.id === id) || null
}

export function categoryOf(key) {
  return CATEGORIES.find((c) => c.key === key) || null
}
