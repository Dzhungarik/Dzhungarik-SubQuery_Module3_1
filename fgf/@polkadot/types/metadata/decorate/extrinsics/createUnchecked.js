// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { assert, stringCamelCase } from '@polkadot/util';

function isTx(tx, callIndex) {
  return tx.callIndex[0] === callIndex[0] && tx.callIndex[1] === callIndex[1];
}
/** @internal */


export function createUnchecked(registry, section, callIndex, callMetadata) {
  const expectedArgs = callMetadata.args;
  const funcName = stringCamelCase(callMetadata.name);

  const extrinsicFn = (...args) => {
    assert(expectedArgs.length === args.length, () => `Extrinsic ${section}.${funcName} expects ${expectedArgs.length.valueOf()} arguments, got ${args.length}.`);
    return registry.createType('Call', {
      args,
      callIndex
    }, callMetadata);
  };

  extrinsicFn.is = tx => isTx(tx, callIndex);

  extrinsicFn.callIndex = callIndex;
  extrinsicFn.meta = callMetadata;
  extrinsicFn.method = funcName;
  extrinsicFn.section = section;

  extrinsicFn.toJSON = () => callMetadata.toJSON();

  return extrinsicFn;
}