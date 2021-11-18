import { renderHook, act } from '@testing-library/react-hooks/native'
import { configure, observable } from 'mobx'
import { useState } from 'react'
import { useWhen } from '../src/useWhen'

configure({
  enforceActions: 'never',
})

describe('useWhen', () => {

  test('effect run when predicate yields true', async () => {

    let obs = observable({ a: 1 })
    let run = false
    renderHook(() => {
      useWhen(() => obs.a > 3, () => {
        run = true
      } )
    })
    obs.a = 2
    expect(run).toBeFalsy()
    obs.a = 4
    expect(run).toBeTruthy()
    run = false
    obs.a = 1
    expect(run).toBeFalsy()

  })

  test('deps changes', async () => {

    let obs = observable({ a: 1 })
    let marker = 0
    let { result } = renderHook(() => {
      let [dep, setDep] = useState(3)
      useWhen(
        () => obs.a > dep,
        () => {
          marker = obs.a
        },
        [dep],
      )
      return setDep
    })
    obs.a = 42
    expect(marker).toBe(42)
    marker = 0
    act(() => {
      result.current(42)
    })
    obs.a = 42
    expect(marker).toBe(0)
  })

})
