// ─────────────────────────────────────────────────────────────
// 픽티업 디자인 시스템 · Bergamot Clay
//
// 확정 팔레트 (컬러차트 기준)
//   #F4EFE4  Warm Porcelain — 메인 배경
//   #FCFAF4  Soft Ivory     — 카드 / 밝은 면 (일러스트 페더 기준색)
//   #4A3B2E  Steeped Umber  — 본문 / 진한 대비
//   #8B7B6A  Umber Soft     — 보조 텍스트 / 아이콘
//   #A7B49A  Sage Glaze     — 포인트(자연·찻잎) + 주요 버튼 유약
//   #956747  Bergamot Clay  — 작은 강조 전용(가격·뱃지·키커)
//   #9A93B5  Lavender Gray  — 감성 포인트(로고 계열·아주 절제)
//
// 확정 규칙
//  · 버튼은 세이지 유약. 클레이는 큰 면적에 쓰지 않음(작은 강조만)
//  · 찻잔은 바닥부터 위로 차오름
//  · 카드 = 얇은 수직 그라디언트 + 3겹 섀도
//  · 일러스트 52px 페더, 기준색 #FCFAF5
//  · 그레인 노이즈는 배경 전용 opacity 3.8%
//  · prefers-reduced-motion 지원
// ─────────────────────────────────────────────────────────────

export const C = {
  porcelain: '#F4EFE4',
  ivory: '#FCFAF4',
  umber: '#4A3B2E',
  umberSoft: '#8B7B6A',
  sage: '#A7B49A',
  sageDeep: '#7E8E72',
  clay: '#956747',
  lavender: '#9A93B5',
  line: '#E4DDCE',
}

export const serif = "'Gowun Batang', serif"
export const sans = "'Gowun Dodum', 'Apple SD Gothic Neo', sans-serif"

// 카테고리 시그니처 — 찻장에서 색으로 취향이 보이게
export const CAT_COLOR = {
  green: '#7E9A6B',
  oolong: '#C9A24A',
  puer: '#8A5A3B',
  black: '#B4653A',
  flower: '#C98492',
}

export const GLOBAL_CSS = `
:root{
  --porcelain:${C.porcelain}; --ivory:${C.ivory};
  --umber:${C.umber}; --umber-soft:${C.umberSoft};
  --sage:${C.sage}; --sage-deep:${C.sageDeep};
  --clay:${C.clay}; --lavender:${C.lavender}; --line:${C.line};

  --sh-card: 0 1px 0 rgba(255,255,255,.9) inset, 0 2px 5px rgba(74,59,46,.05),
             0 8px 16px rgba(74,59,46,.06), 0 18px 34px rgba(74,59,46,.05);
  --sh-lift: 0 -10px 40px rgba(74,59,46,.16);
  --title-shadow: 0 1px 3px rgba(74,59,46,.10);
}

*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{
  font-family:${sans};
  background:linear-gradient(180deg,#F6F1E7,#F0E9DB);
  background-attachment:fixed;
  color:var(--umber);line-height:1.75;
  -webkit-font-smoothing:antialiased;min-height:100dvh;position:relative;
}
/* 그레인 — 배경 전용 3.8% */
body::before{
  content:"";position:fixed;inset:0;opacity:.038;mix-blend-mode:multiply;
  pointer-events:none;z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
button{font-family:inherit;cursor:pointer;color:inherit}
input,textarea{font-family:inherit}
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--sage-deep);outline-offset:2px;border-radius:8px}

.app{max-width:440px;margin:0 auto;position:relative;z-index:1;
  padding:0 0 calc(46px + env(safe-area-inset-bottom));min-height:100dvh}
.pad{padding:0 18px}

/* ── 타이포 ── */
.kicker{font-size:10px;letter-spacing:.22em;color:var(--clay);margin:2px 0 8px;text-transform:uppercase}
.h1{font-family:${serif};font-size:21px;font-weight:700;line-height:1.42;text-shadow:var(--title-shadow)}
.h2{font-family:${serif};font-size:16px;font-weight:700;line-height:1.45;text-shadow:var(--title-shadow)}
.h3{font-family:${serif};font-size:14.5px;font-weight:700}
.body{font-size:13.5px}
.muted{font-size:12px;color:var(--umber-soft)}
.tiny{font-size:11px;color:var(--umber-soft);line-height:1.7}
.qlabel{font-size:12px;color:var(--sage-deep);letter-spacing:.04em;margin-bottom:9px}

/* ── 헤더 ── */
.hdr{display:flex;align-items:center;justify-content:space-between;padding:18px 18px 10px;gap:10px}
.brand{display:flex;align-items:center;gap:9px;min-width:0}
.brand-mark{width:32px;height:32px;border-radius:9px;flex:none;object-fit:cover;
  filter:drop-shadow(0 2px 5px rgba(74,59,46,.16))}
.logotype{font-family:${sans};font-size:16.5px;letter-spacing:.06em;color:var(--umber);white-space:nowrap}
.logotype .with{font-size:11px;letter-spacing:.10em;color:var(--umber-soft);margin-left:5px}

/* ── 탭 — 글래스 ── */
.tabs{display:flex;gap:6px;padding:2px 18px 16px}
.tab{
  flex:1;padding:9px 0;font-size:13px;font-family:${serif};border-radius:13px;
  border:1px solid rgba(228,221,206,.85);color:var(--umber-soft);
  background:linear-gradient(180deg,rgba(255,255,255,.62),rgba(252,250,244,.38));
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  box-shadow:0 1px 0 rgba(255,255,255,.85) inset, 0 2px 6px rgba(74,59,46,.05);
  transition:all .16s ease;
}
.tab.on{
  color:#2E3826;border-color:rgba(126,142,114,.45);
  background:linear-gradient(180deg,rgba(190,201,181,.75),rgba(167,180,154,.55));
  box-shadow:0 1px 0 rgba(255,255,255,.5) inset, 0 -2px 5px rgba(126,142,114,.22) inset;
}

/* ── 카드 — 얇은 수직 그라디언트 + 3겹 섀도 ── */
.card{
  border-radius:18px;padding:17px 16px;margin-bottom:14px;width:100%;
  background:linear-gradient(180deg,#FCFAF5 0%, #F7F1E6 100%);
  border:1px solid rgba(228,221,206,.9);
  box-shadow:var(--sh-card);
}

/* 도감 커버 */
.cover{
  display:block;width:100%;text-align:left;overflow:hidden;border-radius:18px;margin-bottom:14px;
  background:linear-gradient(180deg,#FCFAF5 0%, #F7F1E6 100%);
  border:1px solid rgba(228,221,206,.9);box-shadow:var(--sh-card);
  transition:transform .16s ease;
}
.cover:active{transform:translateY(2px)}
.cover-art{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;background:#FCFAF5}
.cover-body{padding:13px 16px 15px}

/* ── 세이지 유약 버튼 (찻잎 비대칭) ── */
.btn{
  width:100%;font-size:14px;color:#2E3826;border:none;position:relative;
  padding:13px 22px;border-radius:24px 24px 24px 7px;
  background:linear-gradient(180deg,#B9C4AD 0%, #A7B49A 55%, #97A589 100%);
  box-shadow:0 2px 0 rgba(255,255,255,.4) inset, 0 -3px 8px rgba(126,142,114,.35) inset,
    0 6px 14px rgba(126,142,114,.3), 0 2px 4px rgba(126,142,114,.2);
  transition:transform .13s ease, box-shadow .13s ease;
}
.btn::after{
  content:"";position:absolute;left:16%;right:26%;top:5px;height:6px;border-radius:99px;
  background:rgba(255,255,255,.45);filter:blur(1px);
}
.btn:active{
  transform:translateY(2px) rotate(-.4deg);
  box-shadow:0 2px 0 rgba(255,255,255,.35) inset, 0 -2px 5px rgba(126,142,114,.3) inset,
    0 3px 7px rgba(126,142,114,.26);
}
/* 진한 배리에이션 — 보조 */
.btn.deep{
  background:linear-gradient(180deg,#8B9B7E,#7E8E72 60%,#6E7D63);color:#F4F6F0;
  box-shadow:0 2px 0 rgba(255,255,255,.28) inset, 0 -3px 8px rgba(90,104,80,.4) inset,
    0 6px 14px rgba(90,104,80,.32);
}
.btn.sm{padding:10px 18px;font-size:13px;border-radius:20px 20px 20px 6px}
.btn:disabled{opacity:.6}

/* 글래스 아웃라인 버튼 */
.btn-glass{
  width:100%;padding:12px 18px;font-size:13.5px;border-radius:24px 24px 24px 7px;
  color:var(--umber);border:1px solid rgba(228,221,206,.95);
  background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(252,250,244,.42));
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  box-shadow:0 1px 0 rgba(255,255,255,.9) inset, 0 4px 12px rgba(74,59,46,.07);
  display:flex;align-items:center;justify-content:center;gap:9px;
  transition:transform .13s ease;
}
.btn-glass:active{transform:translateY(2px)}

.ghost{background:none;border:none;color:var(--umber-soft);font-size:12.5px;padding:7px 4px}
.ghost.u{text-decoration:underline;text-underline-offset:3px}

/* ── 칩 — 글래스 / 세이지 선택 ── */
.chip{
  font-size:12.5px;padding:7px 13px;border-radius:999px;
  border:1px solid rgba(228,221,206,.9);color:var(--umber-soft);
  background:linear-gradient(180deg,rgba(255,255,255,.7),rgba(252,250,244,.4));
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  box-shadow:0 1px 0 rgba(255,255,255,.9) inset, 0 1px 3px rgba(74,59,46,.06);
  transition:all .14s ease;
}
.chip.on{
  color:#2E3826;border-color:rgba(126,142,114,.5);
  background:linear-gradient(180deg,#B9C4AD,#A7B49A);
  box-shadow:0 2px 5px rgba(126,142,114,.28) inset;
}
.chip-row{display:flex;flex-wrap:wrap;gap:7px}
.chip-scroll{display:flex;gap:7px;overflow-x:auto;padding:3px 0 12px}
.chip-scroll::-webkit-scrollbar{display:none}
.chip-scroll .chip{flex:none}

.tag{font-size:11px;color:var(--umber-soft);background:rgba(244,239,228,.7);
  border:1px solid rgba(228,221,206,.9);border-radius:999px;padding:3px 9px}
/* 클레이는 작은 강조에만 */
.badge{font-size:9.5px;letter-spacing:.05em;background:var(--clay);color:#F4EFE4;
  padding:3px 9px;border-radius:99px}

/* ── 선택지 ── */
.choice{
  width:100%;text-align:left;padding:14px 17px;font-size:14.5px;color:var(--umber);
  border-radius:16px 16px 16px 6px;border:1px solid rgba(228,221,206,.9);
  background:linear-gradient(180deg,rgba(255,255,255,.75),rgba(247,241,230,.55));
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  box-shadow:0 1px 0 rgba(255,255,255,.9) inset, 0 4px 12px rgba(74,59,46,.06);
  transition:all .14s ease;
}
.choice:active{transform:translateY(2px);border-color:rgba(126,142,114,.5)}
.choice-list{display:grid;gap:9px;margin-top:6px}

/* ── 입력 ── */
.field{
  width:100%;padding:12px 13px;font-size:13.5px;line-height:1.7;color:var(--umber);
  background:rgba(252,250,245,.85);border:1px solid rgba(228,221,206,.95);border-radius:13px;
  box-shadow:inset 0 2px 5px rgba(74,59,46,.05);
}
.field::placeholder{color:var(--umber-soft)}
textarea.field{resize:none}

/* ── 오버레이 / 시트 — 글래스 ── */
.ovl{position:fixed;inset:0;background:rgba(74,59,46,.34);backdrop-filter:blur(3px);
  z-index:60;display:flex;justify-content:center;animation:fade .18s ease}
.ovl.center{align-items:center;padding:18px}
.ovl.bottom{align-items:flex-end}
.sheet{
  width:100%;max-width:440px;max-height:90dvh;overflow-y:auto;
  background:linear-gradient(180deg,#FCFAF5 0%, #F7F1E6 100%);
  padding:20px 20px calc(24px + env(safe-area-inset-bottom));box-shadow:var(--sh-lift);
}
.ovl.bottom .sheet{border-radius:22px 22px 0 0;animation:up .24s cubic-bezier(.2,.8,.3,1)}
.ovl.center .sheet{border-radius:20px;animation:pop .2s ease}
.grip{width:38px;height:4px;border-radius:2px;background:var(--line);margin:0 auto 15px}

@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes up{from{transform:translateY(22px);opacity:.6}to{transform:none;opacity:1}}
@keyframes pop{from{transform:scale(.97);opacity:0}to{transform:none;opacity:1}}

.spark{display:inline-block;color:var(--clay);animation:twinkle 2.4s ease-in-out infinite}
@keyframes twinkle{0%,100%{opacity:.45;transform:scale(.9)}50%{opacity:1;transform:scale(1.08)}}

/* ── 온보딩 ── */
.story{border-radius:20px;overflow:hidden;touch-action:pan-y;margin-bottom:0;
  background:linear-gradient(180deg,#FCFAF5 0%, #F7F1E6 100%);
  border:1px solid rgba(228,221,206,.9);box-shadow:var(--sh-card)}
.story-art{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;background:#FCFAF5}
.story-body{padding:17px 18px 19px}
.dots{display:flex;gap:7px;justify-content:center;padding:14px 0 4px}
.dot{width:7px;height:7px;border-radius:50%;background:var(--line);border:none;padding:0;transition:all .2s}
.dot.on{background:var(--clay);width:18px;border-radius:4px}

.art-fallback{width:100%;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(160deg,#FCFAF5,#EFE8DA);color:var(--umber-soft);
  font-size:11.5px;text-align:center;padding:20px;line-height:1.8;white-space:pre-line}
.cover .art-fallback{aspect-ratio:16/10}

/* ── 찻잔 ── */
.cups{display:flex;gap:8px;align-items:center}
.cupbtn{background:none;border:none;padding:0;line-height:0;border-radius:8px}
.cupsvg{display:block;filter:drop-shadow(0 2px 3px rgba(74,59,46,.14))}

/* ── 기록 리스트 (차종 시그니처 점) ── */
.rec{display:flex;align-items:center;gap:11px;padding:13px 2px;border-bottom:1px solid var(--line)}
.rec:last-child{border-bottom:none}
.sig{width:11px;height:11px;border-radius:50%;flex:none;
  box-shadow:0 1px 0 rgba(255,255,255,.7) inset, 0 1px 3px rgba(74,59,46,.18)}

.row{display:flex;gap:12px;padding:10px 0;border-top:1px solid var(--line)}
.row-k{width:54px;flex:none;font-size:11.5px;color:var(--umber-soft)}
.row-v{font-size:13px;flex:1;min-width:0;overflow-wrap:anywhere}
.wrap-safe{overflow-wrap:anywhere;word-break:break-word;min-width:0}

.divider{display:flex;align-items:center;gap:10px;color:var(--umber-soft);font-size:11.5px;margin:14px 0}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--line)}

@media (prefers-reduced-motion: reduce){
  *{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important}
}
`
