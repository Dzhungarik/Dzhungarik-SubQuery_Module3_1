/// <reference types="node" />
import type { HexString } from '@polkadot/util/types';
export declare function createAsHex<T extends (...args: any[]) => Uint8Array>(fn: T): (...args: Parameters<T>) => HexString;
export declare function createBitHasher<T>(bitLength: T, fn: (data: HexString | Buffer | Uint8Array | string, bitLength: T, onlyJs?: boolean) => Uint8Array): (data: HexString | Buffer | Uint8Array | string, onlyJs?: boolean) => Uint8Array;
export declare function isWasmOnly(onlyJs?: boolean): boolean;
