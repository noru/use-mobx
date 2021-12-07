import { IReactionPublic, IReactionOptions } from 'mobx';
import { DependencyList } from 'react';
export declare function useReaction<T, FireImmediately extends boolean = false>(watcher: () => T, effect: (arg: T, prev: FireImmediately extends true ? T | undefined : T, r: IReactionPublic) => void, deps?: DependencyList, opt?: IReactionOptions<T, FireImmediately>): void;
