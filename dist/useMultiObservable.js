import { autorun, isObservable } from 'mobx';
import { useCallback, useEffect, useRef, useState } from 'react';
export function useMultiObservable(...stores) {
    let deps = [...stores];
    stores.forEach(s => {
        if (!isObservable(s)) {
            throw new Error('[use-mobx] useMultiObservable: mapping must be either an Array or an Object');
        }
    });
    let initialized = useRef(false);
    let depsRef = useRef(false);
    let _initializer = useCallback(() => {
        initialized.current = false;
        return stores.map(store => {
            return {
                store,
                keys: Object.getOwnPropertyNames(store),
            };
        });
    }, deps);
    let [storeWithKeys, setState] = useState(_initializer);
    let [, forceUpdate] = useState(0);
    useEffect(() => {
        if (depsRef.current) {
            setState(_initializer());
        }
        else {
            depsRef.current = true; // temp: skip first time run, optimize later
        }
    }, deps);
    useEffect(() => {
        let disposer = autorun(() => {
            // simply visit all props to keep reactive
            storeWithKeys.forEach(({ store, keys }) => {
                keys.forEach(key => store[key]);
            });
            if (!initialized.current) {
                initialized.current = true;
            }
            else {
                forceUpdate(i => ++i);
            }
        });
        return disposer;
    }, deps);
}
