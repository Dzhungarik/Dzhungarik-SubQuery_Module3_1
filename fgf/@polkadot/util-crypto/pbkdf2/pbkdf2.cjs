"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pbkdf2Sync = pbkdf2Sync;

var _util = require("@polkadot/util");

var _bn = require("../bn.cjs");

var _index = require("../hmac/index.cjs");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
// Adapted from https://gist.github.com/calvinmetcalf/91e8e84dc63c75f2aa53
function pbkdf2Sync(password, salt, rounds) {
  let len = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 64;
  let out = new Uint8Array();
  let num = 0;
  const block = (0, _util.u8aConcat)(salt, new Uint8Array(4));

  while (out.length < len) {
    num++;
    block.set((0, _util.bnToU8a)(num, _bn.BN_BE_32_OPTS), salt.length);
    let prev = (0, _index.hmacShaAsU8a)(password, block, 512);
    const md = prev;
    let i = 0;

    while (++i < rounds) {
      prev = (0, _index.hmacShaAsU8a)(password, prev, 512);
      let j = -1;

      while (++j < prev.length) {
        md[j] ^= prev[j];
      }
    }

    out = (0, _util.u8aConcat)(out, md);
  }

  return out.slice(0, len);
}