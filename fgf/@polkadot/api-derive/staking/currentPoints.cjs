"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.currentPoints = currentPoints;

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @description Retrieve the staking overview, including elected and points earned
 */
function currentPoints(instanceId, api) {
  return (0, _index.memo)(instanceId, () => api.derive.session.indexes().pipe((0, _rxjs.switchMap)(({
    activeEra
  }) => api.query.staking.erasRewardPoints(activeEra))));
}