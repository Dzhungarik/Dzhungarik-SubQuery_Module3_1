"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright 2017-2021 @polkadot/types-known authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */
const sharedTypes = {
  CompactAssignments: 'CompactAssignmentsWith16',
  RawSolution: 'RawSolutionWith16',
  Keys: 'SessionKeys6',
  ProxyType: {
    _enum: {
      Any: 0,
      NonTransfer: 1,
      Governance: 2,
      Staking: 3,
      UnusedSudoBalances: 4,
      IdentityJudgement: 5,
      CancelProxy: 6
    }
  }
};
const addrAccountIdTypes = {
  AccountInfo: 'AccountInfoWithRefCount',
  Address: 'AccountId',
  Keys: 'SessionKeys5',
  LookupSource: 'AccountId',
  ValidatorPrefs: 'ValidatorPrefsWithCommission'
}; // these are override types for Polkadot

const versioned = [{
  minmax: [0, 12],
  types: _objectSpread(_objectSpread(_objectSpread({}, sharedTypes), addrAccountIdTypes), {}, {
    CompactAssignments: 'CompactAssignmentsTo257',
    OpenTip: 'OpenTipTo225',
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [13, 22],
  types: _objectSpread(_objectSpread(_objectSpread({}, sharedTypes), addrAccountIdTypes), {}, {
    CompactAssignments: 'CompactAssignmentsTo257',
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [23, 24],
  types: _objectSpread(_objectSpread(_objectSpread({}, sharedTypes), addrAccountIdTypes), {}, {
    RefCount: 'RefCountTo259'
  })
}, {
  minmax: [25, 27],
  types: _objectSpread(_objectSpread({}, sharedTypes), addrAccountIdTypes)
}, {
  minmax: [28, 29],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    AccountInfo: 'AccountInfoWithDualRefCount'
  })
}, {
  minmax: [30, undefined],
  types: _objectSpread({}, sharedTypes)
}];
var _default = versioned;
exports.default = _default;