import { useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 1rem;
`

const highlightStyle = css`
  color: #10b981;
  font-weight: 600;
`

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 p-8">
      <Title>React + TypeScript + Tailwind + Emotion</Title>
      <p className="text-gray-500 text-lg">
        CI/CD 실습용 <span css={highlightStyle}>테스트 애플리케이션 ver.3</span>입니다.
      </p>
      <button
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        onClick={() => setCount((c) => c + 1)}
      >
        count: {count}
      </button>
    </div>
  )
}

export default App
