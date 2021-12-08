import { renderHook, act } from '@testing-library/react-hooks/native'
import { configure, observable } from 'mobx'
import { useState } from 'react'
import { useReaction } from '../src/useReaction'

configure({
  enforceActions: 'never',
})

describe('useReaction', () => {

  test('effect run when watched value change', async () => {

    let obs = observable({ a: 1 })
    let run = false

    renderHook(() => {
      useReaction(() => obs.a > 3, (value) => {
        run = value
      } )
    })
    obs.a = 2
    expect(run).toBeFalsy()
    obs.a = 4
    expect(run).toBeTruthy()
    run = false
    obs.a = 5
    // watched value not change, don't run
    expect(run).toBeFalsy()

    obs.a = 1
    obs.a = 4
    expect(run).toBeTruthy()

  })

  test('deps changes', async () => {

    let obs = observable({ a: 1 })
    let marker = 0
    let { result } = renderHook(() => {
      let [dep, setDep] = useState(3)
      useReaction(
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
