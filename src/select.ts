/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { Store } from './useObservable'

function isObject(obj) {
  let type = typeof obj
  return type === 'function' || type === 'object' && !!obj
}

function isValidMap(map) {
  return Array.isArray(map) || isObject(map)
}

function normalizeMap(map) {
  if (!isValidMap(map)) {
    return []
  }
  return Array.isArray(map)
    ? map.map((key) => ({ key, val: key }))
    : Object.keys(map).map((key) => ({ key: key, val: map[key] }))
}

type ArrayMapping<T> = (keyof T)[]
type ArrayMappingResult<T> = { [key in keyof T]: T[key] }

type ObjectMapping<T> = Record<string, keyof T>
type ObjectMappingResult<T, P extends ObjectMapping<T>> = { [key in keyof P]: T[P[key]] }

/**
 * Often time, only a few properties are needed to be watched by the component, and being reactive to the a large observable may causes performance impact.
 * In this case, you can either write your own initializer to reduce the watched properties, or use `select` to save some hassle.
 *
 * Example:
 * ```typescript
 *
 * let { bastards: { Jon, Ramsay } } = useObservable(select(northFamilies, ['bastards']))
 * // or equivalent
 * let { northBastards: { Jon, Ramsay } } =
 *   useObservable(select(northFamilies, { bastards: 'northBastards' }))
 *
 * ```
 *
 * @param {Observable} observable
 * @param {Object|Array} getters
 * @return {Object}
 * @category Helpers
 */
export function select<T>(store: T, map: ArrayMapping<T>): <Q extends Store = Store>(obj?: Q) => ArrayMappingResult<T> & Q;
export function select<T, P extends ObjectMapping<T>>(store: T, map: P): <Q extends Store = Store>(obj?: Q) => ObjectMappingResult<T, P> & Q;
export function select<T>(store: T, map: any): any {
  if (!isValidMap(map)) {
    console.error('[use-mobx] select: mapping must be either an Array or an Object')
  }
  return (res = {}) => {
    normalizeMap(map).forEach(({ key, val }) => {
      Object.defineProperty(res, key, { get: () => store[val], enumerable: true })
    })
    return res
  }
}
