import { autorun, observable, AnnotationsMap } from 'mobx'
import { useEffect, useRef, useState } from 'react'

type Store = Record<string, any>

/**
 * 
 * @param {() => Observable} initializer 
 * @param {AnnotationsMap<T, never>)} annotations 
 * @returns {Observable} store
 */
export function useObservable<T extends Store>(initializer: () => T, annotations?: AnnotationsMap<T, never>): T {

  let { store, keys } = useState(() => {
    let obj = initializer()
    let keys = Object.keys(obj)
    return {
      store: observable(obj, annotations, { autoBind: true }),
      keys,
    }
  })[0]

  let initialized = useRef(false)
  let [, forceUpdate] = useState(0)

  useEffect(() => {
    autorun(() => {
      // simply visit all props to keep reactive
      keys.forEach(key => store[key])
      if (!initialized.current) {
        initialized.current = true
      } else {
        forceUpdate(i => ++i)
      }
    })
  }, [])
  return store
}