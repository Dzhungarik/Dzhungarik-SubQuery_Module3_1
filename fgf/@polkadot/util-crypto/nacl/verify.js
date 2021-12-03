// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import nacl from 'tweetnacl';
import { assert, u8aToU8a } from '@polkadot/util';
import { ed25519Verify } from '@polkadot/wasm-crypto';
import { isWasmOnly } from "../helpers.js";
/**
 * @name naclSign
 * @summary Verifies the signature on the supplied message.
 * @description
 * Verifies the `signature` on `message` with the supplied `publicKey`. Returns `true` on sucess, `false` otherwise.
 * @example
 * <BR>
 *
 * ```javascript
 * import { naclVerify } from '@polkadot/util-crypto';
 *
 * naclVerify([...], [...], [...]); // => true/false
 * ```
 */

export function naclVerify(message, signature, publicKey, onlyJs) {
  const messageU8a = u8aToU8a(message);
  const publicKeyU8a = u8aToU8a(publicKey);
  const signatureU8a = u8aToU8a(signature);
  assert(publicKeyU8a.length === 32, () => `Invalid publicKey, received ${publicKeyU8a.length}, expected 32`);
  assert(signatureU8a.length === 64, () => `Invalid signature, received ${signatureU8a.length} bytes, expected 64`);
  return isWasmOnly(onlyJs) ? ed25519Verify(signatureU8a, messageU8a, publicKeyU8a) : nacl.sign.detached.verify(messageU8a, signatureU8a, publicKeyU8a);
}