"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bestNumberLag = bestNumberLag;

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name bestNumberLag
 * @returns A number of blocks
 * @description Calculates the lag between finalized head and best head
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.chain.bestNumberLag((lag) => {
 *   console.log(`finalized is ${lag} blocks behind head`);
 * });
 * ```
 */
function bestNumberLag(instanceId, api) {
  return (0, _index.memo)(instanceId, () => (0, _rxjs.combineLatest)([api.derive.chain.bestNumber(), api.derive.chain.bestNumberFinalized()]).pipe((0, _rxjs.map)(([bestNumber, bestNumberFinalized]) => api.registry.createType('BlockNumber', bestNumber.sub(bestNumberFinalized)))));
}