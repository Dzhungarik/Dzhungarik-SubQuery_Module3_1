"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEthereumChecksum = isEthereumChecksum;

var _util = require("@polkadot/util");

var _index = require("../keccak/index.cjs");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
function isInvalidChar(char, byte) {
  return char !== (byte > 7 ? char.toUpperCase() : char.toLowerCase());
}

function isEthereumChecksum(_address) {
  const address = _address.replace('0x', '');

  const hash = (0, _util.u8aToHex)((0, _index.keccakAsU8a)(address.toLowerCase()), -1, false);

  for (let i = 0; i < 40; i++) {
    if (isInvalidChar(address[i], parseInt(hash[i], 16))) {
      return false;
    }
  }

  return true;
}