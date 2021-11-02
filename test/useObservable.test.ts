import { renderHook, act } from '@testing-library/react-hooks/native'
import { useObservable } from '../src/useObservable'

test('should increment counter', () => {
  const { result } = renderHook(() => useObservable())

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)
})