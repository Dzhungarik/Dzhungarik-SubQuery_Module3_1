"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.electedInfo = electedInfo;

var _rxjs = require("rxjs");

var _util = require("@polkadot/util");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
const DEFAULT_FLAGS = {
  withController: true,
  withExposure: true,
  withPrefs: true
};

function combineAccounts(nextElected, validators) {
  return (0, _util.arrayFlatten)([nextElected, validators.filter(v => !nextElected.find(n => n.eq(v)))]);
}

function electedInfo(instanceId, api) {
  return (0, _index.memo)(instanceId, (flags = DEFAULT_FLAGS) => api.derive.staking.validators().pipe((0, _rxjs.switchMap)(({
    nextElected,
    validators
  }) => api.derive.staking.queryMulti(combineAccounts(nextElected, validators), flags).pipe((0, _rxjs.map)(info => ({
    info,
    nextElected,
    validators
  }))))));
}