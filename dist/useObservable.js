import { observable, isObservable, isObservableArray, isObservableMap, isObservableSet, isAction, } from 'mobx';
import { useCallback, useRef, useState, } from 'react';
import { debounceUpdate, useRerender, useUpdateEffect, } from './helper';
import { useAutorun } from './useAutorun';
/**
 * @param {T | () => Observable} initializer Observable initializer
 * @param {Array} deps Dependency list of initializer. When changed, a new observable will be created
 * @param {UseObservableOptions<T>)} options
 * @returns {Observable} store
 */
export function useObservable(initializer, deps = [], options = {}) {
    let initialized = useRef(false);
    let _initializer = useCallback(() => {
        initialized.current = false;
        let obj = typeof initializer === 'function' ? initializer() : initializer;
        return isObservable(obj) ? obj : observable(obj, options.annotations, { autoBind: true });
    }, deps);
    let [store, setState] = useState(_initializer);
    let rerender = useRerender();
    useUpdateEffect(() => setState(_initializer()), [_initializer]);
    useAutorun(() => {
        // simply visit all props to keep reactive
        traverse(store);
        if (!initialized.current) {
            initialized.current = true;
        }
        else {
            let cb = () => options.onUpdate && options.onUpdate(store);
            if (options.nonBatch) {
                rerender();
                cb();
            }
            else {
                debounceUpdate(() => rerender(), cb);
            }
        }
    }, [store], options.autorunOptions);
    return store;
}
function traverse(obs, visited = new Set) {
    if (visited.has(obs) || !isObservable(obs) || isAction(obs)) {
        return;
    }
    visited.add(obs);
    if (isObservableArray(obs) || isObservableSet(obs) || isObservableMap(obs)) {
        obs.forEach(i => traverse(i, visited));
    }
    else {
        let keys = Object.getOwnPropertyNames(obs); // toJS() can visit computed
        keys.forEach(key => {
            let prop = obs[key];
            traverse(prop, visited);
        });
    }
}
