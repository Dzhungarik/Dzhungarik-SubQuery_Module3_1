import type { CodecHash, Hash } from '../interfaces/runtime';
import type { Codec, Registry } from '../types';
/**
 * @name bool
 * @description
 * Representation for a boolean value in the system. It extends the base JS `Boolean` class
 * @noInheritDoc
 */
export declare class bool extends Boolean implements Codec {
    readonly registry: Registry;
    createdAtHash?: Hash;
    constructor(registry: Registry, value?: bool | Boolean | Uint8Array | boolean | number);
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): CodecHash;
    /**
     * @description Checks if the value is an empty value (true when it wraps false/default)
     */
    get isEmpty(): boolean;
    /**
     * @description Checks if the value is an empty value (always false)
     */
    get isFalse(): boolean;
    /**
     * @description Checks if the value is an empty value (always false)
     */
    get isTrue(): boolean;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Returns a hex string representation of the value
     */
    toHex(): string;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(): boolean;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): boolean;
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
}
