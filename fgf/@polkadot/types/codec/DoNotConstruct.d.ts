import type { CodecHash, Hash } from '../interfaces/runtime';
import type { AnyJson, Codec, Constructor, Registry } from '../types';
/**
 * @name DoNotConstruct
 * @description
 * An unknown type that fails on construction with the type info
 */
export declare class DoNotConstruct implements Codec {
    #private;
    readonly registry: Registry;
    createdAtHash?: Hash;
    constructor(registry: Registry, typeName?: string);
    static with(typeName?: string): Constructor;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): CodecHash;
    /**
     * @description Checks if the value is an empty value (always true)
     */
    get isEmpty(): boolean;
    eq(): boolean;
    toHex(): string;
    toHuman(): AnyJson;
    toJSON(): AnyJson;
    toRawType(): string;
    toString(): string;
    toU8a(): Uint8Array;
}
