import {
  reaction, IReactionOptions,
} from 'mobx'
import {
  DependencyList, useEffect, useState,
} from 'react'
import { useUpdateEffect } from './helper'

/**
 * Like useReaction, but immediately return watched value
 * @param watcher
 * @param deps
 * @param opt
 * @returns
 */
export function useWatch<T, FireImmediately extends boolean = false>(
  watcher: () => T,
  deps: DependencyList = [],
  opt?: IReactionOptions<T, FireImmediately>)
{

  let [watched, setWatched] = useState<[T, T?]>([watcher(), undefined])

  useUpdateEffect(() => {
    setWatched([watcher(), watched[0]])
  }, deps)

  useEffect(() => {
    return reaction<T, FireImmediately>(watcher, (curr, prev) => setWatched([curr, prev]), opt)
  }, deps)
  return watched
}