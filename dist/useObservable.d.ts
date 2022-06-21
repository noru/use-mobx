import { AnnotationsMap, IAutorunOptions } from 'mobx';
import { DependencyList } from 'react';
export declare type Store = Record<string, any>;
export declare type UseObservableOptions<T> = {
    annotations?: AnnotationsMap<T, never>;
    onUpdate?: (store: T) => void;
    autorunOptions?: IAutorunOptions;
    nonBatch?: boolean;
};
/**
 * @param {T | () => Observable} initializer Observable initializer
 * @param {Array} deps Dependency list of initializer. When changed, a new observable will be created
 * @param {UseObservableOptions<T>)} options
 * @returns {Observable} store
 */
export declare function useObservable<T extends Store>(initializer: T | (() => T), deps?: DependencyList, options?: UseObservableOptions<T>): T;
