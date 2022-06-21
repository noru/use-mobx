import { useEffect, useState, useRef, useCallback, } from 'react';
// like: https://github.com/streamich/react-use/blob/master/src/useUpdateEffect.ts
export const useUpdateEffect = (effect, deps) => {
    let firstTime = useRef(true);
    useEffect(() => {
        if (firstTime.current) {
            firstTime.current = false;
        }
        else {
            return effect();
        }
    }, deps);
};
export function useRerender() {
    let [, updater] = useState(0);
    return useCallback(() => updater(i => ++i), [updater]);
}
let timeoutId = null;
export function debounceUpdate(updater, callback) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        updater();
        callback();
    });
}
