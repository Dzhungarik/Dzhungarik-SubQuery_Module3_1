import type { AnyNumber, Constructor, Registry } from '../types';
import type { UIntBitLength } from './types';
import { AbstractInt } from './AbstractInt';
/**
 * @name Int
 * @description
 * A generic signed integer codec. For Substrate all numbers are Little Endian encoded,
 * this handles the encoding and decoding of those numbers. Upon construction
 * the bitLength is provided and any additional use keeps the number to this
 * length. This extends `BN`, so all methods available on a normal `BN` object
 * is available here.
 * @noInheritDoc
 */
export declare class Int extends AbstractInt {
    constructor(registry: Registry, value?: AnyNumber, bitLength?: UIntBitLength);
    static with(bitLength: UIntBitLength, typeName?: string): Constructor<Int>;
}
