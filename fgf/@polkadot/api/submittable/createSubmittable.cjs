"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubmittable = createSubmittable;

var _createClass = require("./createClass.cjs");

// Copyright 2017-2021 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0
function createSubmittable(apiType, api, decorateMethod) {
  const Submittable = (0, _createClass.createClass)({
    api,
    apiType,
    decorateMethod
  });
  return extrinsic => new Submittable(api.registry, extrinsic);
}