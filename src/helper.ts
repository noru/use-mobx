import { useEffect, useRef } from 'react'

// like: https://github.com/streamich/react-use/blob/master/src/useUpdateEffect.ts
export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  let firstTime = useRef(true)
  useEffect(() => {
    if (firstTime.current) {
      firstTime.current = false
    } else {
      return effect()
    }
  }, deps)
}