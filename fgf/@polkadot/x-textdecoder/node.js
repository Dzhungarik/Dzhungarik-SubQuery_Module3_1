// Copyright 2017-2021 @polkadot/x-textencoder authors & contributors
// SPDX-License-Identifier: Apache-2.0
import util from 'util';
import { xglobal } from '@polkadot/x-global';
export { packageInfo } from "./packageInfo.js";
export const TextDecoder = typeof xglobal.TextDecoder === 'undefined' ? util.TextDecoder : xglobal.TextDecoder;