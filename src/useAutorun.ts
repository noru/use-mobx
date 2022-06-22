import {
  autorun, IAutorunOptions, IReactionPublic,
} from 'mobx'
import { DependencyList, useEffect } from 'react'

type Effect = (reaction?: IReactionPublic) => unknown

/**
 * A helper hook. See [mobx#autorun](https://mobx.js.org/api.html#autorun) for more information.
 * @param effect
 * @param deps
 * @param options
 * @category Hooks
 */
export function useAutorun(effect: Effect, deps: DependencyList = [], options: IAutorunOptions = {}): void {
  useEffect(() => {
    return autorun(effect, options)
  }, deps)

}