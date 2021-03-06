// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { decodeAddress } from "./decode.js";
/**
 * @name addressToEvm
 * @summary Converts an SS58 address to its corresponding EVM address.
 */

export function addressToEvm(address, ignoreChecksum) {
  const decoded = decodeAddress(address, ignoreChecksum);
  return decoded.subarray(0, 20);
}