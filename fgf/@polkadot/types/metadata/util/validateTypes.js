// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { logger } from '@polkadot/util';
import { extractTypes } from "./extractTypes.js";
import { flattenUniq } from "./flattenUniq.js";
const l = logger('metadata');
/** @internal */

export function validateTypes(registry, throwError, types) {
  const missing = flattenUniq(extractTypes(types)).filter(type => !registry.hasType(type)).sort();

  if (missing.length !== 0) {
    const message = `Unknown types found, no types for ${missing.join(', ')}`;

    if (throwError) {
      throw new Error(message);
    } else {
      l.warn(message);
    }
  }

  return types;
}