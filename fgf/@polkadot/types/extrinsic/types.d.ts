import type { AnyNumber } from '../types';
export interface ExtrinsicOptions {
    isSigned: boolean;
    version: number;
}
export interface ExtrinsicPayloadOptions {
    version: number;
}
export interface ExtrinsicSignatureOptions {
    isSigned?: boolean;
}
export interface ExtrinsicExtraValue {
    era?: Uint8Array;
    nonce?: AnyNumber;
    tip?: AnyNumber;
}
