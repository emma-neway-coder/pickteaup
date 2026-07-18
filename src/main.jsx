import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { GLOBAL_CSS } from './styles.js'

// 전역 스타일 1회 주입 (인라인 CSS 컨벤션이라 프레임워크 없이 처리)
const styleEl = document.createElement('style')
styleEl.textContent = GLOBAL_CSS
document.head.appendChild(styleEl)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
