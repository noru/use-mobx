import { autorun, observable } from 'mobx';
import { useEffect, useRef, useState } from 'react';
export function useObservable(initializer, annotations) {
    let [store, keys] = useState(() => {
        let obj = initializer();
        let keys = Object.keys(obj);
        return [observable(obj, annotations, { autoBind: true }), keys];
    })[0];
    let initialized = useRef(false);
    let [, forceUpdate] = useState(0);
    useEffect(() => {
        autorun(() => {
            // simply visit all props to keep reactive
            keys.forEach(key => store[key]);
            if (!initialized.current) {
                initialized.current = true;
            }
            else {
                forceUpdate(i => ++i);
            }
        });
    }, []);
    return store;
}
