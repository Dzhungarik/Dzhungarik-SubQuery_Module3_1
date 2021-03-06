"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeNewHeads = subscribeNewHeads;

var _rxjs = require("rxjs");

var _index = require("../type/index.cjs");

var _index2 = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name subscribeNewHeads
 * @returns A header with the current header (including extracted author)
 * @description An observable of the current block header and it's author
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.chain.subscribeNewHeads((header) => {
 *   console.log(`block #${header.number} was authored by ${header.author}`);
 * });
 * ```
 */
function subscribeNewHeads(instanceId, api) {
  return (0, _index2.memo)(instanceId, () => (0, _rxjs.combineLatest)([api.rpc.chain.subscribeNewHeads(), api.query.session ? api.query.session.validators() : (0, _rxjs.of)(undefined)]).pipe((0, _rxjs.map)(([header, validators]) => {
    header.createdAtHash = header.hash;
    return (0, _index.createHeaderExtended)(header.registry, header, validators);
  })));
}