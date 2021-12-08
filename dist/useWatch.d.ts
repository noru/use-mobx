import { IReactionOptions } from 'mobx';
import { DependencyList } from 'react';
/**
 * Like useReaction, but immediately return watched value
 * @param watcher
 * @param deps
 * @param opt
 * @returns
 */
export declare function useWatch<T, FireImmediately extends boolean = false>(watcher: () => T, deps?: DependencyList, opt?: IReactionOptions<T, FireImmediately>): [T, (T | undefined)?];
