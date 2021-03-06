"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._eraPrefs = _eraPrefs;
exports.eraPrefs = eraPrefs;
exports._erasPrefs = _erasPrefs;
exports.erasPrefs = erasPrefs;

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
const CACHE_KEY = 'eraPrefs';

function mapPrefs(era, all) {
  const validators = {};
  all.forEach(([key, prefs]) => {
    validators[key.args[1].toString()] = prefs;
  });
  return {
    era,
    validators
  };
}

function _eraPrefs(instanceId, api) {
  return (0, _index.memo)(instanceId, (era, withActive) => {
    const cacheKey = `${CACHE_KEY}-${era.toString()}`;
    const cached = withActive ? undefined : _index.deriveCache.get(cacheKey);
    return cached ? (0, _rxjs.of)(cached) : api.query.staking.erasValidatorPrefs.entries(era).pipe((0, _rxjs.map)(prefs => {
      const value = mapPrefs(era, prefs);
      !withActive && _index.deriveCache.set(cacheKey, value);
      return value;
    }));
  });
}

function eraPrefs(instanceId, api) {
  return (0, _index.memo)(instanceId, era => api.derive.staking._eraPrefs(era, true));
}

function _erasPrefs(instanceId, api) {
  return (0, _index.memo)(instanceId, (eras, withActive) => eras.length ? (0, _rxjs.combineLatest)(eras.map(era => api.derive.staking._eraPrefs(era, withActive))) : (0, _rxjs.of)([]));
}

function erasPrefs(instanceId, api) {
  return (0, _index.memo)(instanceId, (withActive = false) => api.derive.staking.erasHistoric(withActive).pipe((0, _rxjs.switchMap)(eras => api.derive.staking._erasPrefs(eras, withActive))));
}