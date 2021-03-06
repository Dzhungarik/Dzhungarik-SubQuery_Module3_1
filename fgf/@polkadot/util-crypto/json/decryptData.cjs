"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonDecryptData = jsonDecryptData;

var _util = require("@polkadot/util");

var _index = require("../nacl/index.cjs");

var _index2 = require("../scrypt/index.cjs");

var _constants = require("./constants.cjs");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
function jsonDecryptData(encrypted, passphrase) {
  let encType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _constants.ENCODING;
  (0, _util.assert)(encrypted, 'No encrypted data available to decode');
  (0, _util.assert)(passphrase || !encType.includes('xsalsa20-poly1305'), 'Password required to decode encrypted data');
  let encoded = encrypted;

  if (passphrase) {
    let password;

    if (encType.includes('scrypt')) {
      const {
        params,
        salt
      } = (0, _index2.scryptFromU8a)(encrypted);
      password = (0, _index2.scryptEncode)(passphrase, salt, params).password;
      encrypted = encrypted.subarray(_constants.SCRYPT_LENGTH);
    } else {
      password = (0, _util.stringToU8a)(passphrase);
    }

    encoded = (0, _index.naclDecrypt)(encrypted.subarray(_constants.NONCE_LENGTH), encrypted.subarray(0, _constants.NONCE_LENGTH), (0, _util.u8aFixLength)(password, 256, true));
  }

  (0, _util.assert)(encoded, 'Unable to decode using the supplied passphrase');
  return encoded;
}