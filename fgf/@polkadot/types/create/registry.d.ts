import type { ExtDef } from '../extrinsic/signedExtensions/types';
import type { ChainProperties, CodecHash, DispatchErrorModule, Hash, MetadataLatest, PortableRegistry, SiLookupTypeId } from '../interfaces/types';
import type { CallFunction, Codec, CodecHasher, Constructor, DetectCodec, DetectConstructor, RegisteredTypes, Registry, RegistryError, RegistryTypes } from '../types';
import type { CreateOptions } from './types';
import { GenericEventData } from '../generic/Event';
import { Metadata } from '../metadata/Metadata';
export declare class TypeRegistry implements Registry {
    #private;
    createdAtHash?: Hash;
    constructor(createdAtHash?: Hash | Uint8Array | string);
    init(): this;
    get chainDecimals(): number[];
    get chainSS58(): number | undefined;
    get chainTokens(): string[];
    /**
     * @description Returns tru if the type is in a Compat format
     */
    isLookupType(value: string): boolean;
    /**
     * @description Creates a lookup string from the supplied id
     */
    createLookupType(lookupId: SiLookupTypeId | number): string;
    get knownTypes(): RegisteredTypes;
    get lookup(): PortableRegistry;
    get metadata(): MetadataLatest;
    get unknownTypes(): string[];
    get signedExtensions(): string[];
    /**
     * @describe Creates an instance of the class
     */
    createClass<T extends Codec = Codec, K extends string = string>(type: K): DetectConstructor<T, K>;
    /**
     * @description Creates an instance of a type as registered
     */
    createType<T extends Codec = Codec, K extends string = string>(type: K, ...params: unknown[]): DetectCodec<T, K>;
    /**
     * @description Creates an instance of a type as registered
     */
    createTypeUnsafe<T extends Codec = Codec, K extends string = string>(type: K, params: unknown[], options?: CreateOptions): DetectCodec<T, K>;
    findMetaCall(callIndex: Uint8Array): CallFunction;
    findMetaError(errorIndex: Uint8Array | DispatchErrorModule): RegistryError;
    findMetaEvent(eventIndex: Uint8Array): Constructor<GenericEventData>;
    get<T extends Codec = Codec, K extends string = string>(name: K, withUnknown?: boolean): DetectConstructor<T, K> | undefined;
    getChainProperties(): ChainProperties | undefined;
    getClassName(clazz: Constructor): string | undefined;
    getDefinition(typeName: string): string | undefined;
    getModuleInstances(specName: string, moduleName: string): string[] | undefined;
    getOrThrow<T extends Codec = Codec, K extends string = string>(name: K, msg?: string): DetectConstructor<T, K>;
    getOrUnknown<T extends Codec = Codec, K extends string = string>(name: K): DetectConstructor<T, K>;
    getSignedExtensionExtra(): Record<string, string>;
    getSignedExtensionTypes(): Record<string, string>;
    hasClass(name: string): boolean;
    hasDef(name: string): boolean;
    hasType(name: string): boolean;
    hash(data: Uint8Array): CodecHash;
    register(type: Constructor | RegistryTypes): void;
    register(name: string, type: Constructor): void;
    private _registerObject;
    setChainProperties(properties?: ChainProperties): void;
    setHasher(hasher?: CodecHasher | null): void;
    setKnownTypes(knownTypes: RegisteredTypes): void;
    setMetadata(metadata: Metadata, signedExtensions?: string[], userExtensions?: ExtDef): void;
    setSignedExtensions(signedExtensions?: string[], userExtensions?: ExtDef): void;
}
