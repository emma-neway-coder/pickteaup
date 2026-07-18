// 얼그레이 오후 팔레트 (임시 확정) + 공통 토큰
export const C = {
  paper: '#F4EFE4',
  surface: '#FCFAF4',
  ink: '#4A3B2E',
  inkSoft: '#8A7A62',
  line: '#E6DCC4',
  sage: '#A7B49A',
  amber: '#C8763C',
  lavender: '#9A93B5',
  teaGreen: '#BFC888',
  teaOolong: '#D6A257',
  teaPuer: '#8C4A2B',
  teaBlack: '#A0522F',
  teaFlower: '#E2A283',
}

export const serif = "'Gowun Batang', serif"
export const sans = "'Gowun Dodum', 'Apple SD Gothic Neo', sans-serif"

// main.jsx에서 1회 주입하는 전역 스타일
export const GLOBAL_CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  html{-webkit-text-size-adjust:100%}
  body{
    font-family:${sans};
    background:${C.paper};
    color:${C.ink};
    line-height:1.7;
    -webkit-font-smoothing:antialiased;
  }
  button{font-family:inherit;cursor:pointer}
  input,textarea{font-family:inherit}
  :focus-visible{outline:2px solid ${C.lavender};outline-offset:2px}
  @media (prefers-reduced-motion: reduce){
    *{animation-duration:.001ms !important;transition-duration:.001ms !important}
  }
`
