import { AnnotationsMap } from 'mobx';
import { DependencyList } from 'react';
export declare type Store = Record<string, any>;
/**
 *
 * @param {T | () => Observable} initializer Observable initializer
 * @param {Array} deps Dependency list of initializer. When changed, a new observable will be created
 * @param {AnnotationsMap<T, never>)} annotations MobX annotations. See https://mobx.js.org/observable-state.html#available-annotations
 * @returns {Observable} store
 */
export declare function useObservable<T extends Store>(initializer: T | (() => T), deps?: DependencyList, annotations?: AnnotationsMap<T, never>): T;
