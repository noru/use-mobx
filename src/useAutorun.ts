import {
  autorun, IAutorunOptions, IReactionDisposer, IReactionPublic,
} from 'mobx'
import {
  DependencyList, useEffect, useRef,
} from 'react'

type Effect = (reaction?: IReactionPublic) => unknown

/**
 * A helper hook. See [mobx#autorun](https://mobx.js.org/api.html#autorun) for more information.
 * @param effect
 * @param deps
 * @param options
 * @category Hooks
 */
export function useAutorun(effect: Effect, deps: DependencyList = [], options: IAutorunOptions = {}): void {

  let disposer = useRef<IReactionDisposer>()
  if (!disposer.current) {
    disposer.current = autorun(effect, options)
  }
  useEffect(() => {
    if (!disposer.current) {
      disposer.current = autorun(effect, options)
    }
    return () => (disposer.current?.(), disposer.current = undefined)
  }, deps)

}