import { renderHook, act } from '@testing-library/react-hooks/native'
import { configure, observable } from 'mobx'
import { useMultiObservable } from '../src/useMultiObservable'

configure({
  enforceActions: 'never',
})

function testWrapper(count: { render: number }, ...stores) {

  useMultiObservable(...stores)
  count.render += 1
}

describe('useMultiObservable', () => {

  test('be reactive to 1 observable', async () => {

    let ob1 = observable({ a: 1 })
    let count = { render: 0 }
    renderHook(() => testWrapper(count, ob1))

    expect(count.render).toBe(1)
    act(() => {
      ob1.a = 2
    })
    expect(count.render).toBe(2)
    act(() => {
      ob1.a = 2 // not changed
    })
    expect(count.render).toBe(2)
    act(() => {
      ob1.a = 3
    })
    expect(count.render).toBe(3)

  })

  test('be reactive to 1+ observable', async () => {

    let ob1 = observable({ a: 1 })
    let ob2 = observable({ a: 1 })
    let count = { render: 0 }
    renderHook(() => testWrapper(count, ob1, ob2))

    expect(count.render).toBe(1)
    act(() => {
      ob1.a = 2
      ob2.a = 2
    })
    expect(count.render).toBe(2)
    act(() => {
      ob1.a = 2 // not changed
    })
    expect(count.render).toBe(2)
    act(() => {
      ob2.a = 3
    })
    expect(count.render).toBe(3)

  })
})



