import { renderHook, act } from '@testing-library/react-hooks/native'
import { observable } from 'mobx'
import { useState } from 'react'
import { useObservable } from '../src/useObservable'

function testWrapper(initializer) {
  let keys = Object.keys(initializer())
  let state = useObservable(initializer)
  let values = keys.reduce((res, key) => {
    res[key] = state[key]
    return res
  }, {})
  return [state, values]
}

test('useObservable: be reactive to normal props', async () => {
  const { result } = renderHook(() => testWrapper(() => {
    return { prop: 1 }
  }))

  let [store, values] = result.current
  expect(store.prop).toBe(1)
  expect(values.prop).toBe(1)
  act(() => {
    store.prop++
  })
  expect(store.prop).toBe(2)
  expect(values.prop).toBe(1)

  let [store2, newValues] = result.current
  expect(store).toBe(store2)
  expect(newValues.prop).toBe(2)

})

test('useObservable: be reactive to computed props', async () => {
  const { result } = renderHook(() => testWrapper(() => {
    return {
      prop: 1,
      get computedProp() {
        return this.prop + 1
      }
    }
  }))

  let [store, values] = result.current
  expect(store.computedProp).toBe(2)
  expect(values.computedProp).toBe(2)
  act(() => {
    store.prop++
  })
  expect(store.computedProp).toBe(3)
  expect(values.computedProp).toBe(2)

  let [store2, newValues] = result.current
  expect(store).toBe(store2)
  expect(newValues.computedProp).toBe(3)

})

test('useObservable: be reactive to actions', async () => {
  const { result } = renderHook(() => testWrapper(() => {
    return {
      prop: 1,
      action() {
        this.prop += 1
      }
    }
  }))

  let [store, values] = result.current
  expect(store.prop).toBe(1)
  expect(values.prop).toBe(1)
  act(() => {
    store.action()
  })
  expect(store.prop).toBe(2)
  expect(values.prop).toBe(1)

  let [store2, newValues] = result.current
  expect(store).toBe(store2)
  expect(newValues.prop).toBe(2)

})

test('useObservable: be reactive to external observable', async () => {

  let external = observable({ val: 1 })
  const { result } = renderHook(() => testWrapper(() => {
    return {
      get prop() {
        return external.val
      },
    }
  }))

  let [store, values] = result.current
  expect(store.prop).toBe(1)
  expect(values.prop).toBe(1)
  act(() => {
    external.val += 1
  })
  expect(store.prop).toBe(2)
  expect(values.prop).toBe(1)

  let [store2, newValues] = result.current
  expect(store).toBe(store2)
  expect(newValues.prop).toBe(2)

})

test('useObservable: update when dependency', async () => {

  let external = observable({ val: 1 })
  let external2 = observable({ val: 2 })

  function testWrapper() {
    let [store, setStore] = useState(external)

    let local = useObservable(() => {
      return {
        get a() {
          return store.val
        }
      }
    }, [store])
    return { store: local, setDep: setStore }
  }
  const { result } = renderHook(() => testWrapper())

  let { store, setDep } = result.current
  expect(store.a).toBe(1)
  act(() => {
    setDep(external2)
  })
  store = result.current.store
  expect(store.a).toBe(2)

})