// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { assert } from '@polkadot/util';
import { Metadata } from "../Metadata.js";
import { decorateConstants } from "./constants/index.js";
import { decorateErrors } from "./errors/index.js";
import { decorateEvents } from "./events/index.js";
import { decorateExtrinsics } from "./extrinsics/index.js";
import { decorateStorage } from "./storage/index.js";
/**
 * Expands the metadata by decoration into consts, query and tx sections
 */

export function expandMetadata(registry, metadata) {
  assert(metadata instanceof Metadata, 'You need to pass a valid Metadata instance to Decorated');
  const latest = metadata.asLatest;
  const version = metadata.version;
  return {
    consts: decorateConstants(registry, latest, version),
    errors: decorateErrors(registry, latest, version),
    events: decorateEvents(registry, latest, version),
    query: decorateStorage(registry, latest, version),
    tx: decorateExtrinsics(registry, latest, version)
  };
}
export { decorateConstants, decorateErrors, decorateEvents, decorateExtrinsics, decorateStorage };