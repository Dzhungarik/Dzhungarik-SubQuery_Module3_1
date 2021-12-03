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
  rpc: {},
  types: {
    FundIndex: 'u32',
    LastContribution: {
      _enum: {
        Never: 'Null',
        PreEnding: 'u32',
        Ending: 'BlockNumber'
      }
    },
    FundInfo: {
      depositor: 'AccountId',
      verifier: 'Option<MultiSigner>',
      deposit: 'Balance',
      raised: 'Balance',
      end: 'BlockNumber',
      cap: 'Balance',
      lastContribution: 'LastContribution',
      firstPeriod: 'LeasePeriod',
      lastPeriod: 'LeasePeriod',
      trieIndex: 'TrieIndex'
    },
    TrieIndex: 'u32'
  }
};
exports.default = _default;