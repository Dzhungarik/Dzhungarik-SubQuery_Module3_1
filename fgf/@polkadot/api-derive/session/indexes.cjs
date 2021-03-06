"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexes = indexes;

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
// parse into Indexes
function parse([currentIndex, activeEra, activeEraStart, currentEra, validatorCount]) {
  return {
    activeEra,
    activeEraStart,
    currentEra,
    currentIndex,
    validatorCount
  };
} // query based on latest


function queryStaking(api) {
  return api.queryMulti([api.query.session.currentIndex, api.query.staking.activeEra, api.query.staking.currentEra, api.query.staking.validatorCount]).pipe((0, _rxjs.map)(([currentIndex, activeOpt, currentEra, validatorCount]) => {
    const {
      index,
      start
    } = activeOpt.unwrapOrDefault();
    return parse([currentIndex, index, start, currentEra.unwrapOrDefault(), validatorCount]);
  }));
} // query based on latest


function querySession(api) {
  return api.query.session.currentIndex().pipe((0, _rxjs.map)(currentIndex => parse([currentIndex, api.registry.createType('EraIndex'), api.registry.createType('Option<Moment>'), api.registry.createType('EraIndex'), api.registry.createType('u32')])));
} // empty set when none is available


function empty(api) {
  return (0, _rxjs.of)(parse([api.registry.createType('SessionIndex', 1), api.registry.createType('EraIndex'), api.registry.createType('Option<Moment>'), api.registry.createType('EraIndex'), api.registry.createType('u32')]));
}

function indexes(instanceId, api) {
  return (0, _index.memo)(instanceId, () => api.query.session ? api.query.staking ? queryStaking(api) : querySession(api) : empty(api));
}