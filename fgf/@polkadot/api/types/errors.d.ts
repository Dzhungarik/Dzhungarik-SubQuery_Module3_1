import type { IsError } from '@polkadot/types/metadata/decorate/types';
import type { ApiTypes } from './base';
export interface AugmentedErrors<ApiType extends ApiTypes> {
}
export declare type AugmentedError<ApiType extends ApiTypes> = IsError;
export interface ModuleErrors<ApiType extends ApiTypes> {
    [key: string]: AugmentedError<ApiType>;
}
