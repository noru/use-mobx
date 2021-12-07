import { IWhenOptions } from 'mobx';
import { DependencyList } from 'react';
export declare function useWhen(predicate: () => boolean, effect?: () => unknown, deps?: DependencyList, options?: IWhenOptions): void;
