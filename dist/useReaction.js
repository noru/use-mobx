import { reaction, } from 'mobx';
import { useEffect } from 'react';
/**
 * A helper hook. See [mobx#reaction](https://mobx.js.org/api.html#reaction) for more information.
 *
 * @param watcher
 * @param effect
 * @param deps
 * @param opt
 * @category Hooks
 */
export function useReaction(watcher, effect, deps = [], opt) {
    useEffect(() => {
        return reaction(watcher, effect, opt);
    }, deps);
}
