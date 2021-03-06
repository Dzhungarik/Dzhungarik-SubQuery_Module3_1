"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addressToU8a = addressToU8a;

var _decode = require("./decode.cjs");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
function addressToU8a(who) {
  return (0, _decode.decodeAddress)(who);
}