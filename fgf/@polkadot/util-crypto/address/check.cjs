"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAddress = checkAddress;

var _index = require("../base58/index.cjs");

var _checksum = require("./checksum.cjs");

var _defaults = require("./defaults.cjs");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name checkAddress
 * @summary Validates an ss58 address.
 * @description
 * From the provided input, validate that the address is a valid input.
 */
function checkAddress(address, prefix) {
  let decoded;

  try {
    decoded = (0, _index.base58Decode)(address);
  } catch (error) {
    return [false, error.message];
  }

  const [isValid,,, ss58Decoded] = (0, _checksum.checkAddressChecksum)(decoded);

  if (ss58Decoded !== prefix) {
    return [false, `Prefix mismatch, expected ${prefix}, found ${ss58Decoded}`];
  } else if (!_defaults.defaults.allowedEncodedLengths.includes(decoded.length)) {
    return [false, 'Invalid decoded address length'];
  }

  return [isValid, isValid ? null : 'Invalid decoded address checksum'];
}