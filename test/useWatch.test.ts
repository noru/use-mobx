import {
  renderHook, act, waitFor,
} from '@testing-library/react'
import { configure, observable } from 'mobx'
import { useState } from 'react'
import { useWatch } from '../src'

configure({
  enforceActions: 'never',
})

describe('useWatch', () => {

  test('effect run when watched value change', async () => {

    let obs = observable({ a: 1 })

    let { result } = renderHook(() => {
      return useWatch(() => obs.a > 3)
    })
    let prev = result.current
    expect(prev).toEqual([false, undefined])
    act(() => {
      obs.a = 2
    })
    expect(result.current).toEqual(prev)
    act(() => {
      obs.a = 4
    })
    expect(result.current).not.toBe(prev)
    expect(result.current).toEqual([true, false])
    prev = result.current
    act(() => {
      obs.a = 5
    })
    expect(result.current).toEqual(prev)

  })

  test('deps changes', async () => {

    let obs = observable({ a: 1 })
    let { result } = renderHook(() => {
      let [dep, setDep] = useState(3)
      let result = useWatch(
        () => obs.a > dep,
        [dep],
      )
      return [...result, setDep, obs.a]
    })

    await waitFor(() => expect(result.current[0]).toBe(false))

    act(() => {
      obs.a = 42
    })
    expect(result.current[0]).toBe(true)

    act(() => {
      (result.current[2] as any)(42)
    })

    await waitFor(() => {
      expect(result.current[0]).toBe(false)
      expect(result.current[1]).toBe(true)
    })

    act(() => {
      obs.a = 43
    })
    await waitFor(() => {
      expect(result.current[0]).toBe(true)
      expect(result.current[1]).toBe(false)
    })
  })

})
