"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._erasRewards = _erasRewards;
exports.erasRewards = erasRewards;

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

var _util = require("./util.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
const CACHE_KEY = 'eraRewards';

function mapRewards(eras, optRewards) {
  return eras.map((era, index) => ({
    era,
    eraReward: optRewards[index].unwrapOrDefault()
  }));
}

function _erasRewards(instanceId, api) {
  return (0, _index.memo)(instanceId, (eras, withActive) => {
    if (!eras.length) {
      return (0, _rxjs.of)([]);
    }

    const cached = withActive ? [] : eras.map(era => _index.deriveCache.get(`${CACHE_KEY}-${era.toString()}`)).filter(value => !!value);
    const remaining = (0, _util.filterEras)(eras, cached);

    if (!remaining.length) {
      return (0, _rxjs.of)(cached);
    }

    return api.query.staking.erasValidatorReward.multi(remaining).pipe((0, _rxjs.map)(optRewards => {
      const query = mapRewards(remaining, optRewards);
      !withActive && query.forEach(q => _index.deriveCache.set(`${CACHE_KEY}-${q.era.toString()}`, q));
      return eras.map(era => cached.find(cached => era.eq(cached.era)) || query.find(query => era.eq(query.era)));
    }));
  });
}

function erasRewards(instanceId, api) {
  return (0, _index.memo)(instanceId, (withActive = false) => api.derive.staking.erasHistoric(withActive).pipe((0, _rxjs.switchMap)(eras => api.derive.staking._erasRewards(eras, withActive))));
}