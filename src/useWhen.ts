import { when, IWhenOptions } from 'mobx'
import { DependencyList, useEffect } from 'react'

export function useWhen(
  predicate: () => boolean,
  effect: () => unknown = () => void(0),
  deps: DependencyList = [],
  options: IWhenOptions = {},
) {

  useEffect(() => {
    return when(predicate, effect, options)
  }, deps)

}