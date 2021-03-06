// Copyright 2017-2021 @polkadot/rpc-core authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { catchError, distinctUntilChanged, publishReplay, refCount, tap } from 'rxjs';
import { logger, stringify } from '@polkadot/util';
import { refCountDelay } from "./refCountDelay.js";
const l = logger('drr');

const CMP = (a, b) => stringify({
  t: a
}) === stringify({
  t: b
});

const ERR = error => {
  l.error(error.message);
  throw error;
};

const NOOP = () => undefined;
/**
 * Shorthand for distinctUntilChanged(), publishReplay(1) and refCount().
 *
 * @ignore
 * @internal
 */


export const drr = ({
  delay,
  skipChange = false,
  skipTimeout = false
} = {}) => source$ => source$.pipe(catchError(ERR), skipChange ? tap(NOOP) : distinctUntilChanged(CMP), publishReplay(1), skipTimeout ? refCount() : refCountDelay(delay));