import type { CodecHash, Hash } from '../interfaces/runtime';
import type { AnyJson, AnyU8a, IU8a, Registry } from '../types';
/**
 * @name Raw
 * @description
 * A basic wrapper around Uint8Array, with no frills and no fuss. It does differ
 * from other implementations where it will consume the full Uint8Array as passed to it.
 * As such it is meant to be subclassed where the wrapper takes care of the
 * actual lengths instead of used directly.
 * @noInheritDoc
 */
export declare class Raw extends Uint8Array implements IU8a {
    readonly registry: Registry;
    createdAtHash?: Hash;
    constructor(registry: Registry, value?: AnyU8a);
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): CodecHash;
    /**
     * @description Returns true if the wrapped value contains only ASCII printable characters
     */
    get isAscii(): boolean;
    /**
     * @description Returns true if the type wraps an empty/default all-0 value
     */
    get isEmpty(): boolean;
    /**
     * @description Returns true if the wrapped value contains only utf8 characters
     */
    get isUtf8(): boolean;
    /**
     * @description The length of the value
     */
    get length(): number;
    /**
     * @description Returns the number of bits in the value
     */
    bitLength(): number;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Create a new slice from the actual buffer. (compat)
     * @param start The position to start at
     * @param end The position to end at
     */
    slice(start?: number, end?: number): Uint8Array;
    /**
     * @description Create a new subarray from the actual buffer. (compat)
     * @param begin The position to start at
     * @param end The position to end at
     */
    subarray(begin?: number, end?: number): Uint8Array;
    /**
     * @description Returns a hex string representation of the value
     */
    toHex(): string;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(): AnyJson;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): string;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
    /**
     * @description Returns the wrapped data as a UTF-8 string
     */
    toUtf8(): string;
}
