import { autorun } from 'mobx'
import {
  useSyncExternalStore, useCallback,
} from 'react'
import { traverse } from './helper'

/**
 * A test hook for new useSyncExternalStore
 * @experimental
 * @param store
 * @param getSnapshot
 * @returns snapshot
 */
export function useSyncMobX<Store, Snapshot = Store>(store: Store, getSnapshot?: (store: Store) => Snapshot) {

  let _getSnapshot = useCallback(() => {
    return getSnapshot ? getSnapshot(store) : store
  }, [store, getSnapshot])
  let subscribe = useCallback((notify: () => void) => () => {
    return autorun(() => {
      let state = _getSnapshot()
      if (state === store) {
        traverse(state)
      }
      notify()
    })
  }, [_getSnapshot])

  return useSyncExternalStore(subscribe, _getSnapshot)
}