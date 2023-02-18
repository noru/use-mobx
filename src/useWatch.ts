import {
  reaction, IReactionOptions,
} from 'mobx'
import {
  DependencyList, useEffect, useMemo, useState,
} from 'react'

/**
 * A helper hook. Like [[`useReaction`]], but immediately return watched value
 *
 * @param watcher
 * @param deps
 * @param opt
 * @returns
 * @category Hooks
 */
export function useWatch<T, FireImmediately extends boolean = false>(
  watcher: () => T,
  deps: DependencyList = [],
  opt?: IReactionOptions<T, FireImmediately>)
{

  let result = useMemo(() => watcher(), deps)
  let [watched, setWatched] = useState<[T, T?]>([result, undefined])

  useEffect(() => {
    if (watched[0] !== result) {
      setWatched([result, watched[0]])
    }
    return reaction<T, FireImmediately>(watcher, (curr, prev) => setWatched([curr, prev]), opt)
  }, deps)
  return watched
}