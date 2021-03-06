// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { map, switchMap } from 'rxjs';
import { memo } from "../util/index.js";
export function _stakerSlashes(instanceId, api) {
  return memo(instanceId, (accountId, eras, withActive) => {
    const stakerId = api.registry.createType('AccountId', accountId).toString();
    return api.derive.staking._erasSlashes(eras, withActive).pipe(map(slashes => slashes.map(({
      era,
      nominators,
      validators
    }) => ({
      era,
      total: nominators[stakerId] || validators[stakerId] || api.registry.createType('Balance')
    }))));
  });
}
export function stakerSlashes(instanceId, api) {
  return memo(instanceId, (accountId, withActive = false) => api.derive.staking.erasHistoric(withActive).pipe(switchMap(eras => api.derive.staking._stakerSlashes(accountId, eras, withActive))));
}