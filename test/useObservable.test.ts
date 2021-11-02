import { renderHook, act } from '@testing-library/react-hooks/native'
import { useObservable } from '../src/useObservable'

test('should increment counter', async () => {
  const { result } = renderHook(() => useObservable(() => {
    return {
      a: 1,
      get b() {
        return this.a + 1
      },
      c() {
        this.a += 1
      }
    }
  }))

  act(() => {
    result.current.a++
  })

  expect(result.current.a).toBe(2)
  expect(result.current.b).toBe(3)

  act(() => {
    result.current.c()
  })
  expect(result.current.a).toBe(3)
  expect(result.current.b).toBe(4)
})