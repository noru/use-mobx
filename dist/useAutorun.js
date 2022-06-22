import { autorun, } from 'mobx';
import { useEffect } from 'react';
/**
 * A helper hook. See [mobx#autorun](https://mobx.js.org/api.html#autorun) for more information.
 * @param effect
 * @param deps
 * @param options
 * @category Hooks
 */
export function useAutorun(effect, deps = [], options = {}) {
    useEffect(() => {
        return autorun(effect, options);
    }, deps);
}
