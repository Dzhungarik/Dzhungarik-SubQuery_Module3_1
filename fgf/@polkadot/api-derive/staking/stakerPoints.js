// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { map, switchMap } from 'rxjs';
import { memo } from "../util/index.js";
export function _stakerPoints(instanceId, api) {
  return memo(instanceId, (accountId, eras, withActive) => {
    const stakerId = api.registry.createType('AccountId', accountId).toString();
    return api.derive.staking._erasPoints(eras, withActive).pipe(map(points => points.map(({
      era,
      eraPoints,
      validators
    }) => ({
      era,
      eraPoints,
      points: validators[stakerId] || api.registry.createType('RewardPoint')
    }))));
  });
}
export function stakerPoints(instanceId, api) {
  return memo(instanceId, (accountId, withActive = false) => api.derive.staking.erasHistoric(withActive).pipe(switchMap(eras => api.derive.staking._stakerPoints(accountId, eras, withActive))));
}