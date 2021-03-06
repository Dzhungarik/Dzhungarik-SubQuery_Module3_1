"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyHdkdSr25519 = keyHdkdSr25519;

var _deriveHard = require("../schnorrkel/deriveHard.cjs");

var _deriveSoft = require("../schnorrkel/deriveSoft.cjs");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
function keyHdkdSr25519(keypair, _ref) {
  let {
    chainCode,
    isSoft
  } = _ref;
  return isSoft ? (0, _deriveSoft.schnorrkelDeriveSoft)(keypair, chainCode) : (0, _deriveHard.schnorrkelDeriveHard)(keypair, chainCode);
}