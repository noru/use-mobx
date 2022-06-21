import {
  autorun, IAutorunOptions, IReactionPublic,
} from 'mobx'
import { DependencyList, useEffect } from 'react'

type Effect = (reaction?: IReactionPublic) => unknown

export function useAutorun(effect: Effect, deps: DependencyList = [], options: IAutorunOptions = {}): void {
  useEffect(() => {
    return autorun(effect, options)
  }, deps)

}