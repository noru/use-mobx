import { autorun, IReactionPublic } from 'mobx'
import { DependencyList, useEffect } from 'react'

export function useAutorun(effect: (reaction?: IReactionPublic) => unknown, deps: DependencyList = []) {

  useEffect(() => {
    return autorun(effect)
  }, deps)

}