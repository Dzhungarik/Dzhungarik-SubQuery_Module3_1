/// <reference types="bn.js" />
import type { RpcInterface } from '@polkadot/rpc-core/types';
import type { Text } from '@polkadot/types';
import type { Hash, RuntimeVersion } from '@polkadot/types/interfaces';
import type { DecoratedMeta } from '@polkadot/types/metadata/decorate/types';
import type { AnyFunction, Codec, DefinitionRpc, DefinitionRpcSub, DetectCodec, Registry, RegistryTypes } from '@polkadot/types/types';
import type { ApiDecoration, ApiInterfaceRx, ApiOptions, ApiTypes, DecoratedErrors, DecoratedEvents, DecoratedRpc, DecorateMethod, QueryableConsts, QueryableStorage, QueryableStorageAt, QueryableStorageMulti, SubmittableExtrinsics } from '../types';
import type { VersionedRegistry } from './types';
import { BehaviorSubject } from 'rxjs';
import { ExactDerive } from '@polkadot/api-derive';
import { RpcCore } from '@polkadot/rpc-core';
import { Metadata } from '@polkadot/types';
import { BN } from '@polkadot/util';
import { DeriveAllSections } from '../util/decorate';
import { Events } from './Events';
interface FullDecoration<ApiType extends ApiTypes> {
    decoratedApi: ApiDecoration<ApiType>;
    decoratedMeta: DecoratedMeta;
}
export declare abstract class Decorate<ApiType extends ApiTypes> extends Events {
    #private;
    protected __phantom: BN;
    protected _consts: QueryableConsts<ApiType>;
    protected _derive?: ReturnType<Decorate<ApiType>['_decorateDerive']>;
    protected _errors: DecoratedErrors<ApiType>;
    protected _events: DecoratedEvents<ApiType>;
    protected _extrinsics?: SubmittableExtrinsics<ApiType>;
    protected _extrinsicType: number;
    protected _genesisHash?: Hash;
    protected _isConnected: BehaviorSubject<boolean>;
    protected _isReady: boolean;
    protected readonly _options: ApiOptions;
    protected _query: QueryableStorage<ApiType>;
    protected _queryMulti?: QueryableStorageMulti<ApiType>;
    protected _rpc?: DecoratedRpc<ApiType, RpcInterface>;
    protected _rpcCore: RpcCore & RpcInterface;
    protected _runtimeChain?: Text;
    protected _runtimeMetadata?: Metadata;
    protected _runtimeVersion?: RuntimeVersion;
    protected _rx: ApiInterfaceRx;
    protected _type: ApiTypes;
    /**
     * This is the one and only method concrete children classes need to implement.
     * It's a higher-order function, which takes one argument
     * `method: Method extends (...args: any[]) => Observable<any>`
     * (and one optional `options`), and should return the user facing method.
     * For example:
     * - For ApiRx, `decorateMethod` should just be identity, because the input
     * function is already an Observable
     * - For ApiPromise, `decorateMethod` should return a function that takes all
     * the parameters from `method`, adds an optional `callback` argument, and
     * returns a Promise.
     *
     * We could easily imagine other user-facing interfaces, which are simply
     * implemented by transforming the Observable to Stream/Iterator/Kefir/Bacon
     * via `decorateMethod`.
     */
    protected _decorateMethod: DecorateMethod<ApiType>;
    /**
     * @description Create an instance of the class
     *
     * @param options Options object to create API instance or a Provider instance
     *
     * @example
     * <BR>
     *
     * ```javascript
     * import Api from '@polkadot/api/promise';
     *
     * const api = new Api().isReady();
     *
     * api.rpc.subscribeNewHeads((header) => {
     *   console.log(`new block #${header.number.toNumber()}`);
     * });
     * ```
     */
    constructor(options: ApiOptions, type: ApiTypes, decorateMethod: DecorateMethod<ApiType>);
    /**
     * @description Return the current used registry
     */
    get registry(): Registry;
    /**
     * @description Creates an instance of a type as registered
     */
    createType<T extends Codec = Codec, K extends string = string>(type: K, ...params: unknown[]): DetectCodec<T, K>;
    /**
     * @description Register additional user-defined of chain-specific types in the type registry
     */
    registerTypes(types?: RegistryTypes): void;
    /**
     * @returns `true` if the API operates with subscriptions
     */
    get hasSubscriptions(): boolean;
    /**
     * @returns `true` if the API decorate multi-key queries
     */
    get supportMulti(): boolean;
    protected _createDecorated(registry: VersionedRegistry<ApiType>, fromEmpty?: boolean, blockHash?: Uint8Array | null, decoratedApi?: ApiDecoration<ApiType>): FullDecoration<ApiType>;
    protected _injectMetadata(registry: VersionedRegistry<ApiType>, fromEmpty?: boolean): void;
    /**
     * @deprecated
     * backwards compatible endpoint for metadata injection, may be removed in the future (However, it is still useful for testing injection)
     */
    injectMetadata(metadata: Metadata, fromEmpty?: boolean, registry?: Registry): void;
    private _decorateFunctionMeta;
    protected _filterRpc(methods: string[], additional: Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>>): void;
    protected _filterRpcMethods(exposed: string[]): void;
    protected _decorateRpc<ApiType extends ApiTypes>(rpc: RpcCore & RpcInterface, decorateMethod: DecorateMethod<ApiType>, input?: Partial<DecoratedRpc<ApiType, RpcInterface>>): DecoratedRpc<ApiType, RpcInterface>;
    protected _decorateMulti<ApiType extends ApiTypes>(decorateMethod: DecorateMethod<ApiType>): QueryableStorageMulti<ApiType>;
    protected _decorateExtrinsics<ApiType extends ApiTypes>({ tx }: DecoratedMeta, decorateMethod: DecorateMethod<ApiType>): SubmittableExtrinsics<ApiType>;
    private _decorateExtrinsicEntry;
    protected _decorateStorage<ApiType extends ApiTypes>({ query }: DecoratedMeta, decorateMethod: DecorateMethod<ApiType>): QueryableStorage<ApiType>;
    protected _decorateStorageAt<ApiType extends ApiTypes>({ query }: DecoratedMeta, decorateMethod: DecorateMethod<ApiType>, blockHash: Uint8Array): QueryableStorageAt<ApiType>;
    private _decorateStorageEntry;
    private _decorateStorageEntryAt;
    private _decorateStorageCall;
    private _decorateStorageRange;
    private _retrieveMulti;
    private _retrieveMapKeys;
    private _retrieveMapKeysPaged;
    private _retrieveMapEntries;
    private _retrieveMapEntriesPaged;
    protected _decorateDeriveRx(decorateMethod: DecorateMethod<ApiType>): DeriveAllSections<'rxjs', ExactDerive>;
    protected _decorateDerive(decorateMethod: DecorateMethod<ApiType>): DeriveAllSections<ApiType, ExactDerive>;
    /**
     * Put the `this.onCall` function of ApiRx here, because it is needed by
     * `api._rx`.
     */
    protected _rxDecorateMethod: <Method extends AnyFunction>(method: Method) => Method;
}
export {};
