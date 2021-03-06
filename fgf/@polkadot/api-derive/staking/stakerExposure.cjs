"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._stakerExposures = _stakerExposures;
exports.stakerExposures = stakerExposures;
exports.stakerExposure = stakerExposure;

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
function _stakerExposures(instanceId, api) {
  return (0, _index.memo)(instanceId, (accountIds, eras, withActive) => {
    const stakerIds = accountIds.map(a => api.registry.createType('AccountId', a).toString());
    return api.derive.staking._erasExposure(eras, withActive).pipe((0, _rxjs.map)(exposures => stakerIds.map(stakerId => exposures.map(({
      era,
      nominators: allNominators,
      validators: allValidators
    }) => {
      const isValidator = !!allValidators[stakerId];
      const validators = {};
      const nominating = allNominators[stakerId] || [];

      if (isValidator) {
        validators[stakerId] = allValidators[stakerId];
      } else if (nominating) {
        nominating.forEach(({
          validatorId
        }) => {
          validators[validatorId] = allValidators[validatorId];
        });
      }

      return {
        era,
        isEmpty: !Object.keys(validators).length,
        isValidator,
        nominating,
        validators
      };
    }))));
  });
}

function stakerExposures(instanceId, api) {
  return (0, _index.memo)(instanceId, (accountIds, withActive = false) => api.derive.staking.erasHistoric(withActive).pipe((0, _rxjs.switchMap)(eras => api.derive.staking._stakerExposures(accountIds, eras, withActive))));
}

function stakerExposure(instanceId, api) {
  return (0, _index.memo)(instanceId, (accountId, withActive = false) => api.derive.staking.stakerExposures([accountId, withActive]).pipe((0, _rxjs.map)(([first]) => first)));
}