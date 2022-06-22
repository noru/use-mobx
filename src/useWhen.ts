import { when, IWhenOptions } from 'mobx'
import { DependencyList, useEffect } from 'react'


/**
 * A helper hook. See [mobx#when](https://mobx.js.org/api.html#when) for more information.
 *
 * @param predicate
 * @param effect
 * @param deps
 * @param options
 * @category Hooks
 */
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