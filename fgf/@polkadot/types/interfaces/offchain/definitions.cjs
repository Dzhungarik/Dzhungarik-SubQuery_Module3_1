"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
// order important in structs... :)

/* eslint-disable sort-keys */
var _default = {
  rpc: {
    localStorageSet: {
      description: 'Set offchain local storage under given key and prefix',
      params: [{
        name: 'kind',
        type: 'StorageKind'
      }, {
        name: 'key',
        type: 'Bytes'
      }, {
        name: 'value',
        type: 'Bytes'
      }],
      type: 'Null'
    },
    localStorageGet: {
      description: 'Get offchain local storage under given key and prefix',
      params: [{
        name: 'kind',
        type: 'StorageKind'
      }, {
        name: 'key',
        type: 'Bytes'
      }],
      type: 'Option<Bytes>'
    }
  },
  types: {
    StorageKind: {
      _enum: {
        PERSISTENT: 1,
        LOCAL: 2
      }
    }
  }
};
exports.default = _default;