// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { packageInfo as apiInfo } from '@polkadot/api/packageInfo';
import { packageInfo as coreInfo } from '@polkadot/rpc-core/packageInfo';
import { packageInfo as typesInfo } from '@polkadot/types/packageInfo';
import { detectPackage } from '@polkadot/util';
import { packageInfo } from "./packageInfo.js";
detectPackage(packageInfo, typeof __dirname !== 'undefined' && __dirname, [apiInfo, coreInfo, typesInfo]);