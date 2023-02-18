import {
  isAction, isObservable, isObservableArray, isObservableMap, isObservableSet,
} from 'mobx'
import {
  useEffect, useState, useRef, useCallback, EffectCallback, DependencyList,
} from 'react'

/**
 * Like useEffect but skip the first time activation
 *
 * @param effect Imperative function that can return a cleanup function
 * @param deps If present, effect will only activate if the values in the list change.
 * @param strict If true, effect will activate once per deps change. Otherwise it will activate only once.
 */
export const useUpdateEffect = (effect: EffectCallback, deps: DependencyList, strict = true) => {
  let firstTime = useRef(true)
  let reset = useCallback(() => {
    if (strict) {
      firstTime.current = true
    }
  }, [])
  let disposer
  useEffect(() => {
    if (firstTime.current) {
      firstTime.current = false
    } else {
      disposer = effect()
    }
    return () => (reset(), disposer?.())
  }, deps)
}

export function useRerender() {
  let [, updater] = useState(0)
  return useCallback(() => updater(i => ++i), [updater])
}

export function traverse(obs, visited = new Set): void {

  if (visited.has(obs) || !isObservable(obs) || isAction(obs)) {
    return
  }
  visited.add(obs)
  if (isObservableArray(obs) || isObservableSet(obs) || isObservableMap(obs)) {
    obs.forEach(i => traverse(i, visited))
  } else {
    let keys = Object.getOwnPropertyNames(obs) // toJS() cannot visit computed
    keys.forEach(key => {
      let prop = obs[key]
      traverse(prop, visited)
    })
  }
}