import { autorun, observable, AnnotationsMap } from 'mobx'
import { DependencyList, useCallback, useEffect, useRef, useState } from 'react'

type Store = Record<string, any>

/**
 * 
 * @param {T | () => Observable} initializer Observable initializer
 * @param {Array} deps Dependency list of initializer. When changed, a new observable will be created
 * @param {AnnotationsMap<T, never>)} annotations MobX annotations. See https://mobx.js.org/observable-state.html#available-annotations
 * @returns {Observable} store
 */
export function useObservable<T extends Store>(
  initializer: T | (() => T),
  deps: DependencyList = [],
  annotations?: AnnotationsMap<T, never>,
): T {

  let initialized = useRef(false)

  let _initializer = useCallback(() => {
    initialized.current = false
    let obj = typeof initializer === 'function' ? initializer() : initializer
    let keys = Object.keys(obj)
    return {
      store: observable(obj, annotations, { autoBind: true }),
      keys,
    }
  }, deps)

  let [{ store, keys }, setState] = useState(_initializer)
  let [, forceUpdate] = useState(0)

  useEffect(() => setState(_initializer()), deps)
  useEffect(() => {
    let disposer = autorun(() => {
      // simply visit all props to keep reactive
      keys.forEach(key => store[key])
      if (!initialized.current) {
        initialized.current = true
      } else {
        forceUpdate(i => ++i)
      }
    })
    return disposer
  }, [keys, store])


  return store
}