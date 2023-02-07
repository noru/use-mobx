import {
  reaction, IReactionOptions,
} from 'mobx'
import {
  DependencyList, useEffect, useState,
} from 'react'
import { useUpdateEffect } from './helper'

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

  let [watched, setWatched] = useState<[T, T?]>([watcher(), undefined])
  useUpdateEffect(() => {
    let res = watcher()
    res !== watched[0] && setWatched([watcher(), watched[0]])
  }, deps, false)

  useEffect(() => {
    return reaction<T, FireImmediately>(watcher, (curr, prev) => setWatched([curr, prev]), opt)
  }, deps)
  return watched
}