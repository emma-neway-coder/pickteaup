import { Component } from 'react'
import { C, serif } from '../styles.js'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: serif, fontSize: 20, marginBottom: 10 }}>
            잠깐 문제가 생겼어요
          </div>
          <p style={{ color: C.inkSoft, fontSize: 14, marginBottom: 24 }}>
            화면을 불러오다 멈췄어요. 새로고침하면 대부분 돌아와요.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              border: `1px solid ${C.line}`, background: C.surface, color: C.ink,
              borderRadius: 12, padding: '10px 18px', fontSize: 14,
            }}
          >
            새로고침
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
