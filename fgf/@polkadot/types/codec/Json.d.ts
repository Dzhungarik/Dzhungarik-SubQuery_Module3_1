import type { CodecHash, Hash } from '../interfaces/runtime';
import type { AnyJson, Codec, Registry } from '../types';
/**
 * @name Json
 * @description
 * Wraps the a JSON structure retrieve via RPC. It extends the standard JS Map with. While it
 * implements a Codec, it is limited in that it can only be used with input objects via RPC,
 * i.e. no hex decoding. Unlike a struct, this waps a JSON object with unknown keys
 * @noInheritDoc
 */
export declare class Json extends Map<string, any> implements Codec {
    readonly registry: Registry;
    createdAtHash?: Hash;
    constructor(registry: Registry, value?: Record<string, unknown> | null);
    /**
     * @description Always 0, never encodes as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): CodecHash;
    /**
     * @description Checks if the value is an empty value
     */
    get isEmpty(): boolean;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Unimplemented, will throw
     */
    toHex(): string;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(): Record<string, AnyJson>;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): Record<string, AnyJson>;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Unimplemented, will throw
     */
    toU8a(isBare?: boolean): Uint8Array;
}
