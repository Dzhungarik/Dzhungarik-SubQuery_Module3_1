"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fees = fees;

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name fees
 * @returns An object containing the combined results of the storage queries for
 * all relevant fees as declared in the substrate chain spec.
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.balances.fees(({ creationFee, transferFee }) => {
 *   console.log(`The fee for creating a new account on this chain is ${creationFee} units. The fee required for making a transfer is ${transferFee} units.`);
 * });
 * ```
 */
function fees(instanceId, api) {
  return (0, _index.memo)(instanceId, () => {
    var _api$consts$balances, _api$consts$balances2, _api$consts$balances3, _api$consts$transacti, _api$consts$transacti2;

    return (0, _rxjs.of)([// deprecated - remove
    ((_api$consts$balances = api.consts.balances) === null || _api$consts$balances === void 0 ? void 0 : _api$consts$balances.creationFee) || api.registry.createType('Balance'), ((_api$consts$balances2 = api.consts.balances) === null || _api$consts$balances2 === void 0 ? void 0 : _api$consts$balances2.transferFee) || api.registry.createType('Balance'), // current
    ((_api$consts$balances3 = api.consts.balances) === null || _api$consts$balances3 === void 0 ? void 0 : _api$consts$balances3.existentialDeposit) || api.registry.createType('Balance'), ((_api$consts$transacti = api.consts.transactionPayment) === null || _api$consts$transacti === void 0 ? void 0 : _api$consts$transacti.transactionBaseFee) || api.registry.createType('Balance'), ((_api$consts$transacti2 = api.consts.transactionPayment) === null || _api$consts$transacti2 === void 0 ? void 0 : _api$consts$transacti2.transactionByteFee) || api.registry.createType('Balance')]).pipe((0, _rxjs.map)(([creationFee, transferFee, existentialDeposit, transactionBaseFee, transactionByteFee]) => ({
      creationFee,
      existentialDeposit,
      transactionBaseFee,
      transactionByteFee,
      transferFee
    })));
  });
}