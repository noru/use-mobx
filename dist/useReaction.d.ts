import { IReactionPublic, IReactionOptions } from 'mobx';
import { DependencyList } from 'react';
/**
 * A helper hook. See [mobx#reaction](https://mobx.js.org/api.html#reaction) for more information.
 *
 * @param watcher
 * @param effect
 * @param deps
 * @param opt
 * @category Hooks
 */
export declare function useReaction<T, FireImmediately extends boolean = false>(watcher: () => T, effect: (arg: T, prev: FireImmediately extends true ? T | undefined : T, r: IReactionPublic) => void, deps?: DependencyList, opt?: IReactionOptions<T, FireImmediately>): void;
