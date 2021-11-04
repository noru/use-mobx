import { AnnotationsMap } from 'mobx';
import { DependencyList } from 'react';
declare type Store = Record<string, any>;
/**
 *
 * @param {() => Observable} initializer
 * @param {AnnotationsMap<T, never>)} annotations
 * @returns {Observable} store
 */
export declare function useObservable<T extends Store>(initializer: () => T, annotations?: AnnotationsMap<T, never>, deps?: DependencyList): T;
export {};
