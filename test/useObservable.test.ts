/* eslint-disable react-hooks/rules-of-hooks */
import {
  renderHook, act, waitFor,
} from '@testing-library/react'
import { configure, observable } from 'mobx'
import { useState } from 'react'
import { useObservable, UseObservableOptions } from '../src/useObservable'

configure({
  enforceActions: 'never',
})

export function mapObservable2Json(obs, visited = new Set) {
  if (visited.has(obs)) {
    return
  }
  visited.add(obs)
  // unlike toJS(), also map computed props
  let keys = Object.getOwnPropertyNames(obs)
  let json = keys.reduce((res, key) => {
    let val = obs[key]
    res[key] = Array.isArray(val) ? [...val] : (typeof val === 'object' && val !== null) ? mapObservable2Json(val, visited) : val
    return res
  }, {})
  return json
}

function testWrapper(initializer, options: UseObservableOptions<any> = {}) {
  let state = useObservable(typeof initializer === 'function' ? initializer() : initializer, undefined, options)
  let json = mapObservable2Json(state)
  return [state, json]
}

describe('useObservable', () => {
  test('be reactive to normal props', async () => {
    let { result } = renderHook(() => testWrapper(() => {
      return { prop: 1 }
    }))

    let [store, values] = result.current
    expect(store.prop).toBe(1)
    expect(values.prop).toBe(1)
    await act(() => {
      store.prop++
    })
    expect(store.prop).toBe(2)
    expect(values.prop).toBe(1)

    let [store2, newValues] = result.current
    expect(store).toBe(store2)
    expect(newValues.prop).toBe(2)

  })

  test('be reactive to computed props', async () => {
    let { result } = renderHook(() => testWrapper(() => {
      return {
        prop: 1,
        get computedProp() {
          return this.prop + 1
        },
      }
    }))

    let [store, values] = result.current
    expect(store.computedProp).toBe(2)
    expect(values.computedProp).toBe(2)
    await act(() => {
      store.prop++
    })
    expect(store.computedProp).toBe(3)
    expect(values.computedProp).toBe(2)

    let [store2, newValues] = result.current
    expect(store).toBe(store2)
    expect(newValues.computedProp).toBe(3)

  })

  test('be reactive to actions', async () => {
    let { result } = renderHook(() => testWrapper(() => {
      return {
        prop: 1,
        action() {
          this.prop += 1
        },
      }
    }))

    let [store, values] = result.current
    expect(store.prop).toBe(1)
    expect(values.prop).toBe(1)
    await act(() => {
      store.action()
    })
    expect(store.prop).toBe(2)
    expect(values.prop).toBe(1)

    let [store2, newValues] = result.current
    expect(store).toBe(store2)
    expect(newValues.prop).toBe(2)

  })

  test('be reactive to external observable', async () => {

    let external = observable({ val: 1 })
    let { result } = renderHook(() => testWrapper(() => {
      return {
        get prop() {
          return external.val
        },
      }
    }))

    let [store, values] = result.current
    expect(store.prop).toBe(1)
    expect(values.prop).toBe(1)
    await act(() => {
      external.val += 1
    })
    expect(store.prop).toBe(2)
    expect(values.prop).toBe(1)

    let [store2, newValues] = result.current
    expect(store).toBe(store2)
    expect(newValues.prop).toBe(2)

  })

  test('supports plain object', async () => {
    let { result } = renderHook(() => testWrapper({ prop: 1 }))

    let [store, values] = result.current
    expect(store.prop).toBe(1)
    expect(values.prop).toBe(1)
    await act(() => {
      store.prop++
    })
    expect(store.prop).toBe(2)
    expect(values.prop).toBe(1)

    let [store2, newValues] = result.current
    expect(store).toBe(store2)
    expect(newValues.prop).toBe(2)

  })

  test('supports observable', async () => {

    let obser = observable({ prop: 1 }, undefined, { autoBind: true })

    let { result } = renderHook(() => testWrapper(obser))

    let [store, values] = result.current

    expect(obser).toBe(store)
    expect(store.prop).toBe(1)
    expect(values.prop).toBe(1)
    await act(() => {
      obser.prop++
    })
    expect(store.prop).toBe(2)
    expect(values.prop).toBe(1)

    let [store2, newValues] = result.current
    expect(store).toBe(store2)
    expect(newValues.prop).toBe(2)

  })
  test('support deep object', async () => {
    let obser = observable({
      deep: {
        val: 1,
        get valPlus1() {
          return this.val + 1
        },
      },
    })
    let { result } = renderHook(() => testWrapper(obser))

    let [store, values] = result.current

    expect(obser).toBe(store)
    expect(store.deep.val).toBe(1)
    expect(values.deep.val).toBe(1)
    await act(() => {
      obser.deep.val++
    })
    expect(store.deep.val).toBe(2)
    expect(values.deep.val).toBe(1)

    let [store2, newValues] = result.current
    expect(store).toBe(store2)
    expect(newValues.deep.val).toBe(2)
    expect(newValues.deep.valPlus1).toBe(3)
    await act(() => {
      obser.deep.val += 10
    })
    expect(store.deep.val).toBe(12)
    expect(result.current[1].deep.val).toBe(12)
    expect(result.current[1].deep.valPlus1).toBe(13)
  })

  test('support array prop', async () => {
    let obser = observable({
      arr: [1],
    })
    let { result } = renderHook(() => testWrapper(obser))

    let [store, values] = result.current

    expect(obser).toBe(store)
    expect(store.arr[0]).toBe(1)
    expect(values.arr[0]).toBe(1)
    await act(() => {
      obser.arr[0]++
    })
    expect(store.arr[0]).toBe(2)
    expect(values.arr[0]).toBe(1)

    let [store2, newValues] = result.current
    expect(store).toBe(store2)
    expect(newValues.arr[0]).toBe(2)
  })

  test('support circular object', async () => {
    let a = observable({
      val: 1,
      prop: null as any,
    })
    let b = {
      val: 2,
      prop: a,
    }
    a.prop = b
    let { result } = renderHook(() => testWrapper(a))
    expect(result.current[0].val).toBe(1)
    expect(result.current[0].prop.val).toBe(2)

    await act(() => {
      a.val++
      a.prop.val++
    })
    expect(result.current[0].val).toBe(2)
    expect(result.current[0].prop.val).toBe(3)

  })

  test('update when dependency changed', async () => {

    let external = observable({ val: 1 })
    let external2 = observable({ val: 2 })

    function testWrapper() {
      let [store, setStore] = useState(external)

      let local = useObservable(() => {
        return {
          get a() {
            return store.val
          },
        }
      }, [store])
      return { store: local, setDep: setStore }
    }
    let { result } = renderHook(() => testWrapper())

    let { store, setDep } = result.current
    expect(store.a).toBe(1)
    await act(() => {
      setDep(external2)
    })
    store = result.current.store
    waitFor(() => expect(store.a).toBe(2))


  })

  test('plain object, update when dependency', async () => {

    let external = observable({ val: 1 })
    let external2 = observable({ val: 2 })

    function testWrapper() {
      let [store, setStore] = useState(external)

      let local = useObservable({
        get a() {
          return store.val
        },
      }, [store])
      return { store: local, setDep: setStore }
    }
    let { result } = renderHook(() => testWrapper())

    let { store, setDep } = result.current
    expect(store.a).toBe(1)
    await act(() => {
      setDep(external2)
    })
    store = result.current.store
    waitFor(() => expect(store.a).toBe(2))
  })

  test('multiple updates: batch render', async () => {

    let called = 0
    let onUpdate = () => called++
    let { result } = renderHook(() => testWrapper(() => {
      return { prop: 1 }
    }, { onUpdate, batch: true }))

    let [store] = result.current
    await act(() => {
      store.prop++
      store.prop++
      store.prop++
      store.prop++
      store.prop++
    })
    await waitFor(() => {
      let [store2, newValues] = result.current
      expect(called).toBe(1)
      expect(store).toBe(store2)
      expect(newValues.prop).toBe(6)
    })
  })

  test('multiple updates: non-batch render', async () => {

    let called = 0
    let onUpdate = () => called++
    let { result } = renderHook(() => testWrapper(() => {
      return { prop: 1 }
    }, { onUpdate }))

    let [store] = result.current
    await act(() => {
      store.prop++
      store.prop++
      store.prop++
      store.prop++
      store.prop++
    })
    let [store2, newValues] = result.current
    await waitFor(() => {
      expect(called).toBe(5)
      expect(store).toBe(store2)
      expect(newValues.prop).toBe(6)
    })
  })


})
