import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright 2017-2021 @polkadot/types-known authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */
// structs need to be in order

/* eslint-disable sort-keys */
const sharedTypes = {
  FullIdentification: '()',
  // No staking, only session (as per config)
  Keys: 'SessionKeys7B'
};
const versioned = [{
  minmax: [0, 200],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    AccountInfo: 'AccountInfoWithDualRefCount',
    Address: 'AccountId',
    LookupSource: 'AccountId'
  })
}, {
  minmax: [201, 214],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    AccountInfo: 'AccountInfoWithDualRefCount'
  })
}, {
  minmax: [215, 228],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    Keys: 'SessionKeys6'
  })
}, {
  minmax: [229, undefined],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    AssetInstance: 'AssetInstanceV0',
    MultiAsset: 'MultiAssetV0',
    MultiLocation: 'MultiLocationV0',
    Response: 'ResponseV0',
    Xcm: 'XcmV0',
    XcmOrder: 'XcmOrderV0'
  })
}];
export default versioned;