import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { console.error('[ErrorBoundary]', error, info) }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app pad" style={{ paddingTop: 80, textAlign: 'center' }}>
          <div className="h2" style={{ marginBottom: 10 }}>잠깐 문제가 생겼어요</div>
          <p className="muted" style={{ marginBottom: 22 }}>
            화면을 불러오다 멈췄어요. 새로고침하면 대부분 돌아와요.
          </p>
          <button className="btn-plain" onClick={() => window.location.reload()}>새로고침</button>
        </div>
      )
    }
    return this.props.children
  }
}
