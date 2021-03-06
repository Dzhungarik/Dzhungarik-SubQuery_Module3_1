// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { bip39Validate } from '@polkadot/wasm-crypto';
import { isWasmOnly } from "../helpers.js";
import { validateMnemonic } from "./bip39.js";
/**
 * @name mnemonicValidate
 * @summary Validates a mnemonic input using [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).
 * @example
 * <BR>
 *
 * ```javascript
 * import { mnemonicGenerate, mnemonicValidate } from '@polkadot/util-crypto';
 *
 * const mnemonic = mnemonicGenerate(); // => string
 * const isValidMnemonic = mnemonicValidate(mnemonic); // => boolean
 * ```
 */

export function mnemonicValidate(mnemonic, onlyJs) {
  return isWasmOnly(onlyJs) ? bip39Validate(mnemonic) : validateMnemonic(mnemonic);
}