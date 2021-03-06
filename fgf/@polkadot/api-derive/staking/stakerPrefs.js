// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { map, switchMap } from 'rxjs';
import { memo } from "../util/index.js";
export function _stakerPrefs(instanceId, api) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return memo(instanceId, (accountId, eras, _withActive) => api.query.staking.erasValidatorPrefs.multi(eras.map(era => [era, accountId])).pipe(map(all => all.map((validatorPrefs, index) => ({
    era: eras[index],
    validatorPrefs
  })))));
}
export function stakerPrefs(instanceId, api) {
  return memo(instanceId, (accountId, withActive = false) => api.derive.staking.erasHistoric(withActive).pipe(switchMap(eras => api.derive.staking._stakerPrefs(accountId, eras, withActive))));
}