"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ethereumEncode = ethereumEncode;

var _util = require("@polkadot/util");

var _index = require("../keccak/index.cjs");

var _index2 = require("../secp256k1/index.cjs");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
function getH160(u8a) {
  if ([33, 65].includes(u8a.length)) {
    u8a = (0, _index.keccakAsU8a)((0, _index2.secp256k1Expand)(u8a));
  }

  return u8a.slice(-20);
}

function ethereumEncode(addressOrPublic) {
  if (!addressOrPublic) {
    return '0x';
  }

  const u8aAddress = (0, _util.u8aToU8a)(addressOrPublic);
  (0, _util.assert)([20, 32, 33, 65].includes(u8aAddress.length), 'Invalid address or publicKey passed');
  const address = (0, _util.u8aToHex)(getH160(u8aAddress), -1, false);
  const hash = (0, _util.u8aToHex)((0, _index.keccakAsU8a)(address), -1, false);
  let result = '';

  for (let i = 0; i < 40; i++) {
    result = `${result}${parseInt(hash[i], 16) > 7 ? address[i].toUpperCase() : address[i]}`;
  }

  return `0x${result}`;
}