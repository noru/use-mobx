import {
  isAction, isObservable, isObservableArray, isObservableMap, isObservableSet,
} from 'mobx'
import {
  useEffect, useState, useRef, useCallback,
} from 'react'

// like: https://github.com/streamich/react-use/blob/master/src/useUpdateEffect.ts
export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  let firstTime = useRef(true)
  useEffect(() => {
    if (firstTime.current) {
      firstTime.current = false
    } else {
      return effect()
    }
  }, deps)
}

export function useRerender() {
  let [, updater] = useState(0)
  return useCallback(() => updater(i => ++i), [updater])
}

let timeoutId: any = null
export function debounceUpdate(updater, callback) {
  // @ts-ignore
  clearTimeout(timeoutId)
  // @ts-ignore
  timeoutId = setTimeout(() => {
    updater()
    callback()
  })
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