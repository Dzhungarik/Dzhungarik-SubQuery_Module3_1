"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAddress = validateAddress;

var _decode = require("./decode.cjs");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
function validateAddress(encoded, ignoreChecksum, ss58Format) {
  return !!(0, _decode.decodeAddress)(encoded, ignoreChecksum, ss58Format);
}