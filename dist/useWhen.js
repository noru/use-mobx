import { when } from 'mobx';
import { useEffect } from 'react';
export function useWhen(predicate, effect = () => void (0), deps = [], options = {}) {
    useEffect(() => {
        return when(predicate, effect, options);
    }, deps);
}
