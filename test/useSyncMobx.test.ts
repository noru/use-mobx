import {
  renderHook, act, waitFor,
} from '@testing-library/react'
import { configure, observable } from 'mobx'
import { useSyncMobX } from '../src/useSyncMobX'

configure({
  enforceActions: 'never',
})

describe('useSyncMobX', () => {

  test('be reactive to normal props', async () => {
    let store = observable({
      prop: 1,
    })
    let { result, rerender } = renderHook(() => {
      return useSyncMobX(store)
    })
    expect(store).toBe(result.current)
    let state = result.current
    expect(state.prop).toBe(1)

    await act(() => {
      store.prop = 2
    })
    rerender()
    await waitFor(() => expect(result.current.prop).toBe(2))

  })

})
