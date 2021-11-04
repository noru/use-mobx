import { autorun, observable } from 'mobx';
import { useCallback, useEffect, useRef, useState } from 'react';
/**
 *
 * @param {() => Observable} initializer
 * @param {AnnotationsMap<T, never>)} annotations
 * @returns {Observable} store
 */
export function useObservable(initializer, annotations, deps = []) {
    let initialized = useRef(false);
    let _initializer = useCallback(() => {
        initialized.current = false;
        let obj = initializer();
        let keys = Object.keys(obj);
        return {
            store: observable(obj, annotations, { autoBind: true }),
            keys,
        };
    }, deps);
    let [{ store, keys }, setState] = useState(_initializer);
    let [, forceUpdate] = useState(0);
    useEffect(() => setState(_initializer()), deps);
    useEffect(() => {
        let disposer = autorun(() => {
            // simply visit all props to keep reactive
            keys.forEach(key => store[key]);
            if (!initialized.current) {
                initialized.current = true;
            }
            else {
                forceUpdate(i => ++i);
            }
        });
        return disposer;
    }, [keys, store]);
    return store;
}
