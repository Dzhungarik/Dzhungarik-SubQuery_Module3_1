"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.candidates = candidates;

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @description Get the candidate info for a society
 */
function candidates(instanceId, api) {
  return (0, _index.memo)(instanceId, () => api.query.society.candidates().pipe((0, _rxjs.switchMap)(candidates => (0, _rxjs.combineLatest)([(0, _rxjs.of)(candidates), api.query.society.suspendedCandidates.multi(candidates.map(({
    who
  }) => who))])), (0, _rxjs.map)(([candidates, suspended]) => candidates.map(({
    kind,
    value,
    who
  }, index) => ({
    accountId: who,
    isSuspended: suspended[index].isSome,
    kind,
    value
  })))));
}