"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._members = _members;
exports.members = members;

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
function _members(instanceId, api) {
  return (0, _index.memo)(instanceId, accountIds => (0, _rxjs.combineLatest)([(0, _rxjs.of)(accountIds), api.query.society.payouts.multi(accountIds), api.query.society.strikes.multi(accountIds), api.query.society.defenderVotes.multi(accountIds), api.query.society.suspendedMembers.multi(accountIds), api.query.society.vouching.multi(accountIds)]).pipe((0, _rxjs.map)(([accountIds, payouts, strikes, defenderVotes, suspended, vouching]) => accountIds.map((accountId, index) => ({
    accountId,
    isDefenderVoter: defenderVotes[index].isSome,
    isSuspended: suspended[index].isTrue,
    payouts: payouts[index],
    strikes: strikes[index],
    vote: defenderVotes[index].unwrapOr(undefined),
    vouching: vouching[index].unwrapOr(undefined)
  })))));
}
/**
 * @description Get the member info for a society
 */


function members(instanceId, api) {
  return (0, _index.memo)(instanceId, () => api.query.society.members().pipe((0, _rxjs.switchMap)(members => api.derive.society._members(members))));
}