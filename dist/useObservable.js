import { observable, isObservable, isObservableArray, isObservableMap, isObservableSet, } from 'mobx';
import { useCallback, useRef, useState, } from 'react';
import { useUpdateEffect } from './helper';
import { useAutorun } from './useAutorun';
/**
 *
 * @param {T | () => Observable} initializer Observable initializer
 * @param {Array} deps Dependency list of initializer. When changed, a new observable will be created
 * @param {AnnotationsMap<T, never>)} annotations MobX annotations. See https://mobx.js.org/observable-state.html#available-annotations
 * @returns {Observable} store
 */
export function useObservable(initializer, deps = [], annotations) {
    let initialized = useRef(false);
    let _initializer = useCallback(() => {
        initialized.current = false;
        let obj = typeof initializer === 'function' ? initializer() : initializer;
        let keys = Object.getOwnPropertyNames(obj);
        return {
            store: isObservable(obj) ? obj : observable(obj, annotations, { autoBind: true }),
            keys,
        };
    }, deps);
    let [{ store, keys }, setState] = useState(_initializer);
    let [, forceUpdate] = useState(0);
    useUpdateEffect(() => setState(_initializer()), [_initializer]);
    useAutorun(() => {
        // simply visit all props to keep reactive
        traverse(store, keys);
        if (!initialized.current) {
            initialized.current = true;
        }
        else {
            forceUpdate(i => ++i);
        }
    }, [store]);
    return store;
}
function traverse(obs, keys) {
    if (!isObservable(obs)) {
        return;
    }
    if (isObservableArray(obs) || isObservableSet(obs) || isObservableMap(obs)) {
        obs.forEach(i => traverse(i));
    }
    else {
        keys || (keys = Object.getOwnPropertyNames(obs)); // toJS() can visit computed
        keys.forEach(key => {
            let prop = obs[key];
            if (isObservable(prop)) {
                traverse(prop);
            }
        });
    }
}
