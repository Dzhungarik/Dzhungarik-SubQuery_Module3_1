// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { assert } from '@polkadot/util';
export function createSeedDeriveFn(fromSeed, derive) {
  return (keypair, {
    chainCode,
    isHard
  }) => {
    assert(isHard, 'A soft key was found in the path and is not supported');
    return fromSeed(derive(keypair.secretKey.subarray(0, 32), chainCode));
  };
}