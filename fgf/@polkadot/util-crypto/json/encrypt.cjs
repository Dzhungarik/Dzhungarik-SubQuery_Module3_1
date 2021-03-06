"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonEncrypt = jsonEncrypt;

var _util = require("@polkadot/util");

var _index = require("../nacl/index.cjs");

var _index2 = require("../scrypt/index.cjs");

var _encryptFormat = require("./encryptFormat.cjs");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
function jsonEncrypt(data, contentType, passphrase) {
  let isEncrypted = false;
  let encoded = data;

  if (passphrase) {
    const {
      params,
      password,
      salt
    } = (0, _index2.scryptEncode)(passphrase);
    const {
      encrypted,
      nonce
    } = (0, _index.naclEncrypt)(encoded, password.subarray(0, 32));
    isEncrypted = true;
    encoded = (0, _util.u8aConcat)((0, _index2.scryptToU8a)(salt, params), nonce, encrypted);
  }

  return (0, _encryptFormat.jsonEncryptFormat)(encoded, contentType, isEncrypted);
}