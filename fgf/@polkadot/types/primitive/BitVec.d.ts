import type { AnyU8a, Registry } from '../types';
import { Raw } from '../codec/Raw';
/**
 * @name BitVec
 * @description
 * A BitVec that represents an array of bits. The bits are however stored encoded. The difference between this
 * and a normal Bytes would be that the length prefix indicates the number of bits encoded, not the bytes
 */
export declare class BitVec extends Raw {
    private readonly _decodedLength;
    constructor(registry: Registry, value?: AnyU8a);
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    toHuman(): string;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
}
