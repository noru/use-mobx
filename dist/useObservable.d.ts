import { AnnotationsMap, IAutorunOptions } from 'mobx';
import { DependencyList } from 'react';
export declare type Store = Record<string, any>;
/**
 * Options for useObservable
 * @category Types
 */
export declare type UseObservableOptions<T> = {
    /**  MobX annotations. See https://mobx.js.org/observable-state.html#available-annotations */
    annotations?: AnnotationsMap<T, never>;
    /** alled on every update */
    onUpdate?: (store: T) => void;
    /** Mobx autorun options. See https://mobx.js.org/reactions.html#options- */
    autorunOptions?: IAutorunOptions;
    /** By default, multiple observable update will be combined and rerender. For special case, if one rerender per update is needed, set nonBatch to true. */
    nonBatch?: boolean;
};
/**
 * React hooks to make current component reactive to mobx observables, both locally and externally.
 *
 * Example:
 *
 * ```typescript
 * // create local store
 * let localStore = useObservable({ name: 'jon', description: 'Knows nothing' })
 *
 * // use external observable
 * useObservable(storeFromEssos)
 *
 * // mixed
 * let localStore = useObservable({
 *   name: 'jon',
 *   get familyName() {
 *     if (this.name === 'jon') {
 *       return starkFamily.bastardName // 'snow'
 *     } else {
 *       return starkFamily.name // 'stark'
 *     }
 *   }
 * })
 * ```
 *
 * @param {T | () => Observable} initializer Observable initializer
 * @param {Array} deps Dependency list of initializer. When changed, a new observable will be created
 * @param {UseObservableOptions<T>)} options
*  @typedef UseObservableOptions<T> options for useObservable
*  @typeParam T Plain object or an observable
 * @category Hooks
 * @returns {Observable<T>} An observable
 */
export declare function useObservable<T extends Store>(initializer: T | (() => T), deps?: DependencyList, options?: UseObservableOptions<T>): T;
