import type { AnyNumber, AnyString, AnyU8a, Codec, Constructor, ITuple, Registry } from '../types';
import { AbstractArray } from './AbstractArray';
declare type AnyTuple = AnyU8a | string | (Codec | AnyU8a | AnyNumber | AnyString | undefined | null)[];
declare type TupleType = (Constructor | string);
declare type TupleTypes = TupleType[] | {
    [index: string]: Constructor | string;
};
/**
 * @name Tuple
 * @description
 * A Tuple defines an anonymous fixed-length array, where each element has its
 * own type. It extends the base JS `Array` object.
 */
export declare class Tuple extends AbstractArray<Codec> implements ITuple<Codec[]> {
    private _Types;
    constructor(registry: Registry, Types: TupleTypes | TupleType, value?: AnyTuple);
    static with(Types: TupleTypes | TupleType): Constructor<Tuple>;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description The types definition of the tuple
     */
    get Types(): string[];
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
export {};
