// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import nacl from 'tweetnacl';
import { assert, u8aToU8a } from '@polkadot/util';
import { ed25519Sign } from '@polkadot/wasm-crypto';
import { isWasmOnly } from "../helpers.js";
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

export function naclSign(message, {
  publicKey,
  secretKey
}, onlyJs) {
  assert(secretKey, 'Expected a valid secretKey');
  const messageU8a = u8aToU8a(message);
  return isWasmOnly(onlyJs) ? ed25519Sign(publicKey, secretKey.subarray(0, 32), messageU8a) : nacl.sign.detached(messageU8a, secretKey);
}