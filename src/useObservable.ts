import { autorun, observable, AnnotationsMap } from 'mobx'
import { useCallback, useEffect, useRef, useState } from 'react'

type Store = Record<string, any>

type Initializer = () => Store

export function useObservable(initializer: Initializer, annotations?: AnnotationsMap<Store, never>) {

  let ref = useRef(observable(initializer(), annotations, { autoBind: true }))

  let initialized = useRef(false)
  let [dummy, setDummy] = useState(0)

  useEffect(() => {
    autorun(() => {
      if (!initialized.current) {
        console.info('init observer');
        Object.keys(ref.current).forEach(key => ref.current[key])
        initialized.current = true
      } else {
        setDummy(i => ++i)
        console.info('called');
      }
    })
  }, [])
  console.info('render ' + dummy);
  return ref.current
}