// Copyright 2017-2021 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0
// For esm, this should be import.meta.url or to get the same behavior as __dirname, we can use
//
//   new URL(import.meta.url).pathname)
//
// The issue is the WP4 has "some" issues with import.meta.url. So because of bundlers, we can't have
// nice things... In this case it is even worse since import.meta.url won't even make it compile, so
// there is a complete dead end with usage thereof
//
// When that is fixed, a solution is to have both .js & .mjs files, with the following content -
//
// cjs: util.detectPackage(packageInfo, () => __dirname);
// esm: detectPackage(packageInfo, () => import.meta.url);
//
// With the above we additionally need a .d.ts to just export the packageInfo
import { packageInfo as decoderInfo } from '@polkadot/x-textdecoder';
import { packageInfo as encoderInfo } from '@polkadot/x-textencoder';
import { packageInfo } from "./packageInfo.js";
import { detectPackage } from "./versionDetect.js";
detectPackage(packageInfo, typeof __dirname !== 'undefined' && __dirname, [decoderInfo, encoderInfo]);