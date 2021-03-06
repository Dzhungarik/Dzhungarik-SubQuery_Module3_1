"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addressToEvm = addressToEvm;

var _decode = require("./decode.cjs");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name addressToEvm
 * @summary Converts an SS58 address to its corresponding EVM address.
 */
function addressToEvm(address, ignoreChecksum) {
  const decoded = (0, _decode.decodeAddress)(address, ignoreChecksum);
  return decoded.subarray(0, 20);
}