"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.accountId = accountId;

var _rxjs = require("rxjs");

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
function retrieve(api, address) {
  const decoded = (0, _util.isU8a)(address) ? address : (0, _utilCrypto.decodeAddress)((address || '').toString());

  if (decoded.length > 8) {
    return (0, _rxjs.of)(api.registry.createType('AccountId', decoded));
  }

  const accountIndex = api.registry.createType('AccountIndex', decoded);
  return api.derive.accounts.indexToId(accountIndex.toString()).pipe((0, _rxjs.map)(accountId => (0, _util.assertReturn)(accountId, 'Unable to retrieve accountId')));
}
/**
 * @name accountId
 * @param {(Address | AccountId | AccountIndex | string | null)} address - An accounts address in various formats.
 * @description  An [[AccountId]]
 */


function accountId(instanceId, api) {
  return (0, _index.memo)(instanceId, address => retrieve(api, address));
}