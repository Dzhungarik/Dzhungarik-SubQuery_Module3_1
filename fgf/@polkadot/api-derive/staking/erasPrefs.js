// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { combineLatest, map, of, switchMap } from 'rxjs';
import { deriveCache, memo } from "../util/index.js";
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

export function _eraPrefs(instanceId, api) {
  return memo(instanceId, (era, withActive) => {
    const cacheKey = `${CACHE_KEY}-${era.toString()}`;
    const cached = withActive ? undefined : deriveCache.get(cacheKey);
    return cached ? of(cached) : api.query.staking.erasValidatorPrefs.entries(era).pipe(map(prefs => {
      const value = mapPrefs(era, prefs);
      !withActive && deriveCache.set(cacheKey, value);
      return value;
    }));
  });
}
export function eraPrefs(instanceId, api) {
  return memo(instanceId, era => api.derive.staking._eraPrefs(era, true));
}
export function _erasPrefs(instanceId, api) {
  return memo(instanceId, (eras, withActive) => eras.length ? combineLatest(eras.map(era => api.derive.staking._eraPrefs(era, withActive))) : of([]));
}
export function erasPrefs(instanceId, api) {
  return memo(instanceId, (withActive = false) => api.derive.staking.erasHistoric(withActive).pipe(switchMap(eras => api.derive.staking._erasPrefs(eras, withActive))));
}