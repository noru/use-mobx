import { reaction, } from 'mobx';
import { useEffect, useState, } from 'react';
import { useUpdateEffect } from './helper';
/**
 * A helper hook. Like [[`useReaction`]], but immediately return watched value
 *
 * @param watcher
 * @param deps
 * @param opt
 * @returns
 * @category Hooks
 */
export function useWatch(watcher, deps = [], opt) {
    let [watched, setWatched] = useState([watcher(), undefined]);
    useUpdateEffect(() => {
        setWatched([watcher(), watched[0]]);
    }, deps);
    useEffect(() => {
        return reaction(watcher, (curr, prev) => setWatched([curr, prev]), opt);
    }, deps);
    return watched;
}
