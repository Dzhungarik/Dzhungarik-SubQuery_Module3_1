import type { Codec, Constructor, Registry } from '../types';
import { AbstractArray } from './AbstractArray';
/**
 * @name Vec
 * @description
 * This manages codec arrays. Internally it keeps track of the length (as decoded) and allows
 * construction with the passed `Type` in the constructor. It is an extension to Array, providing
 * specific encoding/decoding on top of the base type.
 */
export declare class Vec<T extends Codec> extends AbstractArray<T> {
    private _Type;
    constructor(registry: Registry, Type: Constructor<T> | string, value?: Vec<Codec> | Uint8Array | string | unknown[]);
    /** @internal */
    static decodeVec<T extends Codec>(registry: Registry, Type: Constructor<T>, value: Vec<Codec> | Uint8Array | string | unknown[]): T[];
    static with<O extends Codec>(Type: Constructor<O> | string): Constructor<Vec<O>>;
    /**
     * @description The type for the items
     */
    get Type(): string;
    /**
     * @description Finds the index of the value in the array
     */
    indexOf(_other?: unknown): number;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
