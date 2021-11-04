import { autorun, observable, AnnotationsMap } from 'mobx'
import { DependencyList, useCallback, useEffect, useRef, useState } from 'react'

type Store = Record<string, any>

/**
 * 
 * @param {() => Observable} initializer 
 * @param {AnnotationsMap<T, never>)} annotations 
 * @returns {Observable} store
 */
export function useObservable<T extends Store>(initializer: () => T, annotations?: AnnotationsMap<T, never>, deps: DependencyList = []): T {

  let initialized = useRef(false)

  let _initializer = useCallback(() => {
    initialized.current = false
    let obj = initializer()
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