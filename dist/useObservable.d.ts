import { AnnotationsMap } from 'mobx';
declare type Store = Record<string, any>;
declare type Initializer = () => Store;
export declare function useObservable(initializer: Initializer, annotations?: AnnotationsMap<Store, never>): Store;
export {};
