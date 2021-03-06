// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { assert, stringToU8a } from '@polkadot/util';
import { bip39ToMiniSecret } from '@polkadot/wasm-crypto';
import { isWasmOnly } from "../helpers.js";
import { pbkdf2Encode } from "../pbkdf2/index.js";
import { mnemonicToEntropy } from "./toEntropy.js";
import { mnemonicValidate } from "./validate.js";
export function mnemonicToMiniSecret(mnemonic, password = '', onlyJs) {
  assert(mnemonicValidate(mnemonic), 'Invalid bip39 mnemonic specified');

  if (isWasmOnly(onlyJs)) {
    return bip39ToMiniSecret(mnemonic, password);
  }

  const entropy = mnemonicToEntropy(mnemonic);
  const salt = stringToU8a(`mnemonic${password}`); // return the first 32 bytes as the seed

  return pbkdf2Encode(entropy, salt).password.slice(0, 32);
}