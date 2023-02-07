import { renderHook, act } from '@testing-library/react'
import { configure, observable } from 'mobx'
import { useState } from 'react'
import { useAutorun } from '../src/useAutorun'

configure({
  enforceActions: 'never',
})

describe('useAutorun', () => {

  test('effect run immediately', async () => {

    let obs = observable({ a: 1 })
    let marker = 0
    renderHook(() => {
      useAutorun(() => {
        marker = obs.a
      } )
    })
    expect(marker).toBe(1)
  })

  test('effect autorun by changes', async () => {

    let obs = observable({ a: 1 })
    let marker = 0

    renderHook(() => {
      useAutorun(() => {
        marker = obs.a
      } )
    })
    obs.a = 42
    expect(marker).toBe(42)
    obs.a = 861112
    expect(marker).toBe(861112)
  })

  test('deps changes', async () => {

    let obs = observable({ a: 1 })
    let marker = 0
    let { result } = renderHook(() => {
      let [dep, setDep] = useState(1)
      useAutorun(() => {
        marker = obs.a
      }, [dep])
      return setDep
    })
    obs.a = 42
    expect(marker).toBe(42)
    marker = 0
    act(() => {
      result.current(2)
    })
    expect(marker).toBe(42)
  })

})
