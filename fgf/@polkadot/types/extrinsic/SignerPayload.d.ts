import type { Address, Balance, BlockNumber, Call, ExtrinsicEra, Hash, Index, RuntimeVersion } from '../interfaces';
import type { Codec, ISignerPayload, Registry, SignerPayloadJSON, SignerPayloadRaw } from '../types';
import { Compact } from '../codec/Compact';
import { Struct } from '../codec/Struct';
import { Vec } from '../codec/Vec';
import { Text } from '../primitive/Text';
import { u8 } from '../primitive/U8';
export interface SignerPayloadType extends Codec {
    address: Address;
    blockHash: Hash;
    blockNumber: BlockNumber;
    era: ExtrinsicEra;
    genesisHash: Hash;
    method: Call;
    nonce: Compact<Index>;
    runtimeVersion: RuntimeVersion;
    signedExtensions: Vec<Text>;
    tip: Compact<Balance>;
    version: u8;
}
/**
 * @name GenericSignerPayload
 * @description
 * A generic signer payload that can be used for serialization between API and signer
 */
export declare class GenericSignerPayload extends Struct implements ISignerPayload, SignerPayloadType {
    private readonly _extraTypes;
    constructor(registry: Registry, value?: string | {
        [x: string]: any;
    } | Map<unknown, unknown> | unknown[]);
    get address(): Address;
    get blockHash(): Hash;
    get blockNumber(): BlockNumber;
    get era(): ExtrinsicEra;
    get genesisHash(): Hash;
    get method(): Call;
    get nonce(): Compact<Index>;
    get runtimeVersion(): RuntimeVersion;
    get signedExtensions(): Vec<Text>;
    get tip(): Compact<Balance>;
    get version(): u8;
    /**
     * @description Creates an representation of the structure as an ISignerPayload JSON
     */
    toPayload(): SignerPayloadJSON;
    /**
     * @description Creates a representation of the payload in raw Exrinsic form
     */
    toRaw(): SignerPayloadRaw;
}
