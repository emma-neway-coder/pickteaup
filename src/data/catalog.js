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
    blurb: '풀 내음처럼 산뜻하고 개운한 맛.',
    teaware: '넓고 얕은 사발에, 잎이 도는 걸 보며',
  },
  {
    key: 'oolong', name: '청차 · 우롱차', vessel: '작은 잔', art: 't2-oolong',
    mood: '#A9793C', moodWord: 'Floral',
    blurb: '꽃향과 구수함 사이를 오가는 맛.',
    teaware: '개완을 열어 향을 먼저',
  },
  {
    key: 'puer', name: '보이차', vessel: '자사호 잔', art: 't3-puer',
    mood: '#7A4A2F', moodWord: 'Deep',
    blurb: '흙내음이 도는 부드럽고 깊은 맛.',
    teaware: '두툼한 자사호로 진하게',
  },
  {
    key: 'black', name: '홍차', vessel: '유럽식 잔', art: 't5-black',
    mood: '#9A5333', moodWord: 'Malty',
    blurb: '붉게 우러나는, 달고 묵직한 맛.',
    teaware: '손잡이 잔에 받침까지, 우유도 곁들여',
  },
  {
    key: 'flower', name: '꽃차', vessel: '유리 다관', art: 't4-flower',
    mood: '#B0705E', moodWord: 'Blooming',
    blurb: '잔 속에서 피어나는, 맑고 향긋한 맛.',
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
    taste: '이른 봄 첫 잎의, 여린 감칠맛과 은은한 꽃향이 도는 맛.',
    brew: '70℃ 안팎으로 낮게, 1~2분. 뜨거우면 쓴맛이 올라와요.',
  },
  {
    id: 'g-sejak', cat: 'green', name: '보성 세작',
    caffeine: 'mid', body: 'light', difficulty: 1,
    flavor: ['fresh', 'grassy', 'umami'],
    taste: '갓 딴 잎처럼 풋풋하고 산뜻한 맛.',
    brew: '75℃, 1~2분.',
  },
  {
    id: 'g-hyeonmi', cat: 'green', name: '현미녹차',
    caffeine: 'low', body: 'light', difficulty: 1,
    flavor: ['nutty', 'roasty', 'sweet'],
    taste: '볶은 현미가 고소하고, 녹차는 산뜻한 맛.',
    brew: '80℃, 1~2분. 부담 없이 자주.',
  },
  {
    id: 'g-matcha', cat: 'green', name: '말차',
    caffeine: 'high', body: 'medium', difficulty: 2,
    flavor: ['umami', 'grassy', 'nutty'],
    taste: '잎을 통째로 갈아 진하게 감칠맛이 도는 맛.',
    brew: '70~80℃ 물 소량에 격불(솔로 저어 거품)해서, 진하게.',
  },
  {
    id: 'g-okro', cat: 'green', name: '옥로',
    caffeine: 'high', body: 'medium', difficulty: 2,
    flavor: ['umami', 'sweet', 'fresh'],
    taste: '햇빛을 가려 키워, 감칠맛이 깊고 단정한 맛.',
    brew: '60℃ 안팎으로 아주 낮게, 2분 이상 느긋하게.',
  },

  // ── 청차 · 우롱차 ──
  {
    id: 'o-tieguanyin', cat: 'oolong', name: '철관음',
    caffeine: 'mid', body: 'medium', difficulty: 1,
    flavor: ['floral', 'fresh', 'sweet'],
    taste: '난꽃 같은 향과 맑은 단맛이 나는, 가벼운 우롱의 맛.',
    brew: '90~95℃로 여러 번 짧게 우려요.',
  },
  {
    id: 'o-dahongpao', cat: 'oolong', name: '대홍포',
    caffeine: 'mid', body: 'full', difficulty: 2,
    flavor: ['roasty', 'deep', 'nutty'],
    taste: '불에 볶은 깊은 향(암운)이 도는, 진하고 묵직한 맛.',
    brew: '95℃로 짧게 여러 번.',
  },
  {
    id: 'o-oriental', cat: 'oolong', name: '동방미인',
    caffeine: 'mid', body: 'medium', difficulty: 2,
    flavor: ['fruity', 'sweet', 'floral'],
    taste: '잘 익은 과일과 꿀처럼 단 향이 도는 맛.',
    brew: '85~90℃, 짧게.',
  },
  {
    id: 'o-dancong', cat: 'oolong', name: '봉황단총',
    caffeine: 'mid', body: 'medium', difficulty: 3,
    flavor: ['floral', 'fruity', 'roasty'],
    taste: '한 나무에서 복숭아·난꽃 같은 향이 겹겹이 피는 맛.',
    brew: '95℃로 짧게 여러 번. 향이 층층이 바뀌어요.',
  },
  {
    id: 'o-baozhong', cat: 'oolong', name: '문산포종',
    caffeine: 'mid', body: 'light', difficulty: 2,
    flavor: ['floral', 'fresh', 'grassy'],
    taste: '거의 볶지 않아, 백합처럼 맑고 산뜻하게 향긋한 맛.',
    brew: '90℃, 짧게 여러 번.',
  },

  // ── 보이차 ──
  {
    id: 'p-shou', cat: 'puer', name: '숙차 (익힘)',
    caffeine: 'mid', body: 'full', difficulty: 2,
    flavor: ['earthy', 'deep', 'smooth', 'sweet'],
    taste: '흙내음이 돌면서 부드럽고 단, 깊은 맛.',
    brew: '95~100℃, 첫 물은 헹궈 버리고 짧게 여러 번.',
  },
  {
    id: 'p-sheng', cat: 'puer', name: '생차 (날것)',
    caffeine: 'high', body: 'full', difficulty: 3,
    flavor: ['deep', 'fruity', 'smooth'],
    taste: '쌉쌀함 뒤에 단맛이 돌아오는(회감), 세월이 만든 맛.',
    brew: '95℃, 짧게. 오래 우리면 강해져요.',
  },
  {
    id: 'p-xiaoqinggan', cat: 'puer', name: '소청감 (귤보이)',
    caffeine: 'mid', body: 'medium', difficulty: 1,
    flavor: ['citrus', 'smooth', 'sweet'],
    taste: '작은 귤 속에 숙차를 채워, 상큼한 귤향과 부드러운 맛.',
    brew: '95~100℃, 껍질째 짧게 여러 번.',
  },
  {
    id: 'p-moonlight', cat: 'puer', name: '월광백',
    caffeine: 'mid', body: 'medium', difficulty: 2,
    flavor: ['sweet', 'fruity', 'smooth'],
    taste: '그늘에 말려, 꿀과 잘 익은 과일처럼 은은하게 단 맛.',
    brew: '90~95℃, 짧게 여러 번.',
  },

  // ── 홍차 (4종) ──
  {
    id: 'b-earlgrey', cat: 'black', name: '얼그레이',
    caffeine: 'mid', body: 'medium', difficulty: 1,
    flavor: ['citrus', 'floral', 'fresh'],
    taste: '베르가모트가 시트러스하게 향긋한, 이름부터 익숙한 맛.',
    brew: '95℃, 3분 안팎. 우유·설탕 없이도 향으로 즐겨요.',
  },
  {
    id: 'b-assam', cat: 'black', name: '아쌈',
    caffeine: 'high', body: 'full', difficulty: 1,
    flavor: ['malty', 'sweet', 'deep'],
    taste: '설탕 없이도 단맛이 도는, 밀크티로 익숙한 몰티한 맛.',
    brew: '95℃, 3~4분. 우유와 특히 잘 맞아요.',
  },
  {
    id: 'b-darjeeling', cat: 'black', name: '다르질링',
    caffeine: 'mid', body: 'medium', difficulty: 2,
    flavor: ['fruity', 'floral', 'fresh'],
    taste: '머스캣 포도를 닮은 향이 화사하게 도는 맛.',
    brew: '90~95℃, 3분. 스트레이트로 향을 즐겨요.',
  },
  {
    id: 'b-english', cat: 'black', name: '잉글리시 브렉퍼스트',
    caffeine: 'high', body: 'full', difficulty: 1,
    flavor: ['malty', 'deep', 'roasty'],
    taste: '진하고 묵직해 아침·우유와 잘 맞는 맛.',
    brew: '95℃, 3~4분.',
  },

  // ── 꽃차 ──
  {
    id: 'f-chrysanth', cat: 'flower', name: '국화차',
    caffeine: 'none', body: 'light', difficulty: 1,
    flavor: ['floral', 'fresh', 'sweet'],
    taste: '맑고 은은한 꽃향이 도는, 카페인 없이 편한 맛.',
    brew: '90℃, 유리 다관에 3~4분. 피어나는 모습을 함께.',
  },
  {
    id: 'f-rose', cat: 'flower', name: '장미차',
    caffeine: 'none', body: 'light', difficulty: 1,
    flavor: ['floral', 'fruity', 'sweet'],
    taste: '달큰하고 화사하게 장미 향이 나는 맛.',
    brew: '90℃, 3분.',
  },
  {
    id: 'f-plum', cat: 'flower', name: '매화차',
    caffeine: 'none', body: 'light', difficulty: 2,
    flavor: ['floral', 'fresh'],
    taste: '이른 봄 매화처럼 섬세하고 여린 향의 맛.',
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
