import { autorun, observable, AnnotationsMap } from 'mobx'
import { useCallback, useEffect, useRef, useState } from 'react'

type Store = Record<string, any>

type Initializer = () => Store

export function useObservable(initializer: Initializer, annotations?: AnnotationsMap<Store, never>) {

  let [store, keys] = useState(() => {
    let obj = initializer()
    let keys = Object.keys(obj)
    return [observable(obj, annotations, { autoBind: true }), keys]
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