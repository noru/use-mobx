import { autorun, IReactionPublic } from 'mobx'
import { DependencyList, useEffect } from 'react'

export function useAutorun(execute: (reaction?: IReactionPublic) => unknown, deps: DependencyList = []) {

  useEffect(() => {
    return autorun(execute)
  }, deps)

}