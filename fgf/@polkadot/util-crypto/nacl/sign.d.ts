import type { HexString } from '@polkadot/util/types';
import type { Keypair } from '../types';
/**
 * @name naclSign
 * @summary Signs a message using the supplied secretKey
 * @description
 * Returns message signature of `message`, using the `secretKey`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { naclSign } from '@polkadot/util-crypto';
 *
 * naclSign([...], [...]); // => [...]
 * ```
 */
export declare function naclSign(message: HexString | Uint8Array | string, { publicKey, secretKey }: Partial<Keypair>, onlyJs?: boolean): Uint8Array;
