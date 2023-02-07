import { isObservable } from 'mobx'
import {
  useCallback, useRef, useState,
} from 'react'
import { useUpdateEffect } from './helper'
import { useAutorun } from './useAutorun'
import { Store } from './useObservable'


/**
 *
 * @param stores
 * @returns
 * @category Hooks
 */
export function useMultiObservable<T extends Array<Store>>(...stores: T): T {
  let deps = [...stores]
  stores.forEach((s, i) => {
    if (!isObservable(s)) {
      throw new Error(`[use-mobx] useMultiObservable: all arguments must be observables. Check item with index ${i}`)
    }
  })
  let initialized = useRef(false)

  let _initializer = useCallback(() => {

    initialized.current = false
    return stores.map(store => {
      return {
        store,
        keys: Object.getOwnPropertyNames(store),
      }
    })
  }, deps)

  let [storeWithKeys, setState] = useState(_initializer)
  let [, forceUpdate] = useState(0)

  useUpdateEffect(() => setState(_initializer()), [_initializer], false)

  useAutorun(() => {
    // simply visit all props to keep reactive
    storeWithKeys.forEach(({ store, keys }) => {
      keys.forEach(key => store[key])
    })
    if (!initialized.current) {
      initialized.current = true
    } else {
      forceUpdate(i => ++i)
    }
  }, deps)

  return stores
}


