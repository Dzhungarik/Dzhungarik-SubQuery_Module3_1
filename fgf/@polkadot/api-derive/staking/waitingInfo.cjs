"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitingInfo = waitingInfo;

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
const DEFAULT_FLAGS = {
  withController: true,
  withPrefs: true
};

function waitingInfo(instanceId, api) {
  return (0, _index.memo)(instanceId, (flags = DEFAULT_FLAGS) => (0, _rxjs.combineLatest)([api.derive.staking.validators(), api.derive.staking.stashes()]).pipe((0, _rxjs.switchMap)(([{
    nextElected
  }, stashes]) => {
    const elected = nextElected.map(a => a.toString());
    const waiting = stashes.filter(v => !elected.includes(v.toString()));
    return api.derive.staking.queryMulti(waiting, flags).pipe((0, _rxjs.map)(info => ({
      info,
      waiting
    })));
  })));
}