import { autorun } from 'mobx'
import { useCallback, useState } from 'react'

export function useObservable() {
  const [count, setCount] = useState(0)

  const increment = useCallback(() => setCount((x) => x + 1), [])

  return { count, increment }
}