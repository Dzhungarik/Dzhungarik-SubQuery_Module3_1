import type { Observable } from 'rxjs';
import type { StorageKey, u64 } from '@polkadot/types';
import type { Hash } from '@polkadot/types/interfaces';
import type { StorageEntry } from '@polkadot/types/primitive/types';
import type { AnyFunction, AnyTuple, Callback, Codec, IStorageKey } from '@polkadot/types/types';
import type { ApiTypes, DropLast, MethodResult, ObsInnerType, PaginationOptions, PromiseOrObs, UnsubscribePromise } from './base';
interface StorageEntryObservableMulti {
    <T extends Codec>(args: (unknown[] | unknown)[]): Observable<T[]>;
}
interface StorageEntryPromiseMulti {
    <T extends Codec>(args: (unknown[] | unknown)[]): Promise<T[]>;
    <T extends Codec>(args: (unknown[] | unknown)[], callback: Callback<T[]>): UnsubscribePromise;
}
export interface StorageEntryPromiseOverloads {
    (arg1?: unknown, arg2?: unknown, arg3?: unknown): Promise<Codec>;
    <T extends Codec>(arg1?: unknown, arg2?: unknown, arg3?: unknown): Promise<T>;
    <T extends Codec>(callback: Callback<T>): UnsubscribePromise;
    <T extends Codec>(arg: unknown, callback: Callback<T>): UnsubscribePromise;
    <T extends Codec>(arg1: unknown, arg2: unknown, callback: Callback<T>): UnsubscribePromise;
    <T extends Codec>(arg1: unknown, arg2: unknown, arg3: unknown, callback: Callback<T>): UnsubscribePromise;
}
export interface StorageEntryPromiseOverloadsAt {
    (arg1?: unknown, arg2?: unknown, arg3?: unknown): Promise<Codec>;
    <T extends Codec>(arg1?: unknown, arg2?: unknown, arg3?: unknown): Promise<T>;
}
declare type GenericStorageEntryFunction = (...args: unknown[]) => Observable<Codec>;
export declare type QueryableStorageEntry<ApiType extends ApiTypes, A extends AnyTuple = AnyTuple> = ApiType extends 'rxjs' ? AugmentedQuery<'rxjs', GenericStorageEntryFunction, A> : AugmentedQuery<'promise', GenericStorageEntryFunction, A> & StorageEntryPromiseOverloads;
export declare type QueryableStorageEntryAt<ApiType extends ApiTypes, A extends AnyTuple = AnyTuple> = ApiType extends 'rxjs' ? AugmentedQueryAt<'rxjs', GenericStorageEntryFunction, A> : AugmentedQueryAt<'promise', GenericStorageEntryFunction, A> & StorageEntryPromiseOverloadsAt;
export interface QueryableStorageAt<ApiType extends ApiTypes> extends AugmentedQueries<ApiType> {
    [key: string]: QueryableModuleStorageAt<ApiType>;
}
export interface StorageEntryBase<ApiType extends ApiTypes, F extends AnyFunction, A extends AnyTuple = AnyTuple> {
    at: <T extends Codec | any = ObsInnerType<ReturnType<F>>>(hash: Hash | Uint8Array | string, ...args: Parameters<F>) => PromiseOrObs<ApiType, T>;
    creator: StorageEntry;
    entries: <T extends Codec | any = ObsInnerType<ReturnType<F>>, K extends AnyTuple = A>(...args: DropLast<Parameters<F>>) => PromiseOrObs<ApiType, [StorageKey<K>, T][]>;
    entriesAt: <T extends Codec | any = ObsInnerType<ReturnType<F>>, K extends AnyTuple = A>(hash: Hash | Uint8Array | string, ...args: DropLast<Parameters<F>>) => PromiseOrObs<ApiType, [StorageKey<K>, T][]>;
    entriesPaged: <T extends Codec | any = ObsInnerType<ReturnType<F>>, K extends AnyTuple = A>(opts: PaginationOptions<Parameters<F>[0]>) => PromiseOrObs<ApiType, [StorageKey<K>, T][]>;
    hash: (...args: Parameters<F>) => PromiseOrObs<ApiType, Hash>;
    is: (key: IStorageKey<AnyTuple>) => key is IStorageKey<A>;
    key: (...args: Parameters<F>) => string;
    keyPrefix: (...args: DropLast<Parameters<F>>) => string;
    keys: <K extends AnyTuple = A>(...args: DropLast<Parameters<F>>) => PromiseOrObs<ApiType, StorageKey<K>[]>;
    keysAt: <K extends AnyTuple = A>(hash: Hash | Uint8Array | string, ...args: DropLast<Parameters<F>>) => PromiseOrObs<ApiType, StorageKey<K>[]>;
    keysPaged: <K extends AnyTuple = A>(opts: PaginationOptions<Parameters<F>[0]>) => PromiseOrObs<ApiType, StorageKey<K>[]>;
    range: <T extends Codec | any = ObsInnerType<ReturnType<F>>>([from, to]: [Hash | Uint8Array | string, Hash | Uint8Array | string | undefined] | [Hash | Uint8Array | string], ...args: Parameters<F>) => PromiseOrObs<ApiType, [Hash, T][]>;
    size: (...args: Parameters<F>) => PromiseOrObs<ApiType, u64>;
    sizeAt: (hash: Hash | Uint8Array | string, ...args: Parameters<F>) => PromiseOrObs<ApiType, u64>;
    multi: ApiType extends 'rxjs' ? StorageEntryObservableMulti : StorageEntryPromiseMulti;
}
export interface StorageEntryBaseAt<ApiType extends ApiTypes, F extends AnyFunction, A extends AnyTuple = AnyTuple> {
    entries: <T extends Codec | any = ObsInnerType<ReturnType<F>>, K extends AnyTuple = A>(...args: DropLast<Parameters<F>>) => PromiseOrObs<ApiType, [StorageKey<K>, T][]>;
    hash: (...args: Parameters<F>) => PromiseOrObs<ApiType, Hash>;
    is: (key: IStorageKey<AnyTuple>) => key is IStorageKey<A>;
    key: (...args: Parameters<F>) => string;
    keyPrefix: (...args: DropLast<Parameters<F>>) => string;
    keys: <K extends AnyTuple = A>(...args: DropLast<Parameters<F>>) => PromiseOrObs<ApiType, StorageKey<K>[]>;
    size: (...args: Parameters<F>) => PromiseOrObs<ApiType, u64>;
}
export interface QueryableModuleStorage<ApiType extends ApiTypes> {
    [index: string]: QueryableStorageEntry<ApiType, AnyTuple>;
}
export interface QueryableModuleStorageAt<ApiType extends ApiTypes> {
    [index: string]: QueryableStorageEntryAt<ApiType, AnyTuple>;
}
export declare type QueryableStorageMultiArg<ApiType extends ApiTypes> = QueryableStorageEntry<ApiType> | [
    QueryableStorageEntry<ApiType>,
    ...unknown[]
];
export interface QueryableStorageMultiBase<ApiType extends ApiTypes> {
    <T extends Codec[]>(calls: QueryableStorageMultiArg<ApiType>[]): Observable<T>;
}
export interface QueryableStorageMultiPromise<ApiType extends ApiTypes> {
    <T extends Codec[]>(calls: QueryableStorageMultiArg<ApiType>[], callback: Callback<T>): UnsubscribePromise;
    <T extends Codec[]>(calls: QueryableStorageMultiArg<ApiType>[]): Promise<T>;
}
export declare type QueryableStorageMulti<ApiType extends ApiTypes> = ApiType extends 'rxjs' ? QueryableStorageMultiBase<ApiType> : QueryableStorageMultiPromise<ApiType>;
export interface AugmentedQueries<ApiType extends ApiTypes> {
}
export declare type AugmentedQuery<ApiType extends ApiTypes, F extends AnyFunction, A extends AnyTuple = AnyTuple> = MethodResult<ApiType, F> & StorageEntryBase<ApiType, F, A>;
export declare type AugmentedQueryAt<ApiType extends ApiTypes, F extends AnyFunction, A extends AnyTuple = AnyTuple> = MethodResult<ApiType, F> & StorageEntryBaseAt<ApiType, F, A>;
export declare type AugmentedQueryDoubleMap<ApiType extends ApiTypes, F extends AnyFunction, A extends AnyTuple = AnyTuple> = AugmentedQuery<ApiType, F, A>;
export {};
