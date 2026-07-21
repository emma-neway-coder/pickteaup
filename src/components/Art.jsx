import { useState } from 'react'

export default function Art({ name, alt = '', className = 'story-art', note }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className="art-fallback">{note || `일러스트 준비 중\n${name}`}</div>
  return (
    <img className={className} alt={alt} loading="lazy"
      src={`${import.meta.env.BASE_URL}illustrations/${name}.jpg`}
      onError={() => setFailed(true)} />
  )
}
