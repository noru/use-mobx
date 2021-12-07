import { reaction, } from 'mobx';
import { useEffect } from 'react';
export function useReaction(watcher, effect, deps = [], opt) {
    useEffect(() => {
        return reaction(watcher, effect, opt);
    }, deps);
}
