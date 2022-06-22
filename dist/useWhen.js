import { when } from 'mobx';
import { useEffect } from 'react';
/**
 * A helper hook. See [mobx#when](https://mobx.js.org/api.html#when) for more information.
 *
 * @param predicate
 * @param effect
 * @param deps
 * @param options
 * @category Hooks
 */
export function useWhen(predicate, effect = () => void (0), deps = [], options = {}) {
    useEffect(() => {
        return when(predicate, effect, options);
    }, deps);
}
