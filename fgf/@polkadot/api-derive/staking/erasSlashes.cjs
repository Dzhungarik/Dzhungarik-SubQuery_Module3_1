"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._eraSlashes = _eraSlashes;
exports.eraSlashes = eraSlashes;
exports._erasSlashes = _erasSlashes;
exports.erasSlashes = erasSlashes;

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
const CACHE_KEY = 'eraSlashes';

function mapSlashes(era, noms, vals) {
  const nominators = {};
  const validators = {};
  noms.forEach(([key, optBalance]) => {
    nominators[key.args[1].toString()] = optBalance.unwrap();
  });
  vals.forEach(([key, optRes]) => {
    validators[key.args[1].toString()] = optRes.unwrapOrDefault()[1];
  });
  return {
    era,
    nominators,
    validators
  };
}

function _eraSlashes(instanceId, api) {
  return (0, _index.memo)(instanceId, (era, withActive) => {
    const cacheKey = `${CACHE_KEY}-${era.toString()}`;
    const cached = withActive ? undefined : _index.deriveCache.get(cacheKey);
    return cached ? (0, _rxjs.of)(cached) : (0, _rxjs.combineLatest)([api.query.staking.nominatorSlashInEra.entries(era), api.query.staking.validatorSlashInEra.entries(era)]).pipe((0, _rxjs.map)(([noms, vals]) => {
      const value = mapSlashes(era, noms, vals);
      !withActive && _index.deriveCache.set(cacheKey, value);
      return value;
    }));
  });
}

function eraSlashes(instanceId, api) {
  return (0, _index.memo)(instanceId, era => api.derive.staking._eraSlashes(era, true));
}

function _erasSlashes(instanceId, api) {
  return (0, _index.memo)(instanceId, (eras, withActive) => eras.length ? (0, _rxjs.combineLatest)(eras.map(era => api.derive.staking._eraSlashes(era, withActive))) : (0, _rxjs.of)([]));
}

function erasSlashes(instanceId, api) {
  return (0, _index.memo)(instanceId, (withActive = false) => api.derive.staking.erasHistoric(withActive).pipe((0, _rxjs.switchMap)(eras => api.derive.staking._erasSlashes(eras, withActive))));
}