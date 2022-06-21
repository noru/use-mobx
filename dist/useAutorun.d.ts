import { IAutorunOptions, IReactionPublic } from 'mobx';
import { DependencyList } from 'react';
declare type Effect = (reaction?: IReactionPublic) => unknown;
export declare function useAutorun(effect: Effect, deps?: DependencyList, options?: IAutorunOptions): void;
export {};
