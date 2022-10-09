import {
  observable, AnnotationsMap, IAutorunOptions,
  isObservable, isObservableArray, isObservableMap, isObservableSet, isAction,
} from 'mobx'
import {
  DependencyList, useCallback, useRef, useState,
} from 'react'
import {
  debounceUpdate, traverse, useRerender, useUpdateEffect,
} from './helper'
import { useAutorun } from './useAutorun'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Store = Record<string, any>


/**
 * Options for useObservable
 * @category Types
 */
export type UseObservableOptions<T> = {
  /**  MobX annotations. See https://mobx.js.org/observable-state.html#available-annotations */
  annotations?: AnnotationsMap<T, never>
  /** A hook called on every update */
  onUpdate?: (store: T) => void
  /** Mobx autorun options. See https://mobx.js.org/reactions.html#options- */
  autorunOptions?: IAutorunOptions
  /** By default, each update will be run synchronously. Set this flat to true if you want to batch multiple update and render once. */
  batch?: boolean
}
/**
 * React hooks to make current component reactive to mobx observables, both locally and externally.
 *
 * Example:
 *
 * ```typescript
 * // create local store
 * let localStore = useObservable({ name: 'jon', description: 'Knows nothing' })
 *
 * // use external observable
 * useObservable(storeFromEssos)
 *
 * // mixed
 * let localStore = useObservable({
 *   name: 'jon',
 *   get familyName() {
 *     if (this.name === 'jon') {
 *       return starkFamily.bastardName // 'snow'
 *     } else {
 *       return starkFamily.name // 'stark'
 *     }
 *   }
 * })
 * ```
 *
 * @param {T | () => Observable} initializer Observable initializer
 * @param {Array} deps Dependency list of initializer. When changed, a new observable will be created
 * @param {UseObservableOptions<T>)} options
*  @typedef UseObservableOptions<T> options for useObservable
*  @typeParam T Plain object or an observable
 * @category Hooks
 * @returns {Observable<T>} An observable
 */
export function useObservable<T extends Store>(
  initializer: T | (() => T),
  deps: DependencyList = [],
  options: UseObservableOptions<T> = {},
): T {

  let initialized = useRef(false)

  let _initializer = useCallback(() => {
    initialized.current = false
    let obj = typeof initializer === 'function' ? initializer() : initializer
    return isObservable(obj) ? obj : observable(obj, options.annotations, { autoBind: true })
  }, deps)

  let [store, setState] = useState(_initializer)
  let rerender = useRerender()

  useUpdateEffect(() => setState(_initializer()), [_initializer])

  useAutorun(() => {
    // simply visit all props to keep reactive
    traverse(store)
    if (!initialized.current) {
      initialized.current = true
    } else {
      let cb = () => options.onUpdate && options.onUpdate(store)
      if (options.batch) {
        debounceUpdate(() => rerender(), cb)
      } else {
        rerender()
        cb()
      }
    }
  }, [store], options.autorunOptions)
  return store
}
