import type { AnyU8a, Registry } from '../types';
import { U8aFixed } from '../codec/U8aFixed';
/**
 * @name GenericEthereumAccountId
 * @description
 * A wrapper around an Ethereum-compatible AccountId. Since we are dealing with
 * underlying addresses (20 bytes in length), we extend from U8aFixed which is
 * just a Uint8Array wrapper with a fixed length.
 */
export declare class GenericEthereumAccountId extends U8aFixed {
    constructor(registry: Registry, value?: AnyU8a);
    static encode(value: Uint8Array): string;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(): string;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): string;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
