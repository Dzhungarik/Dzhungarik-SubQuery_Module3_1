"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandMetadata = expandMetadata;
Object.defineProperty(exports, "decorateConstants", {
  enumerable: true,
  get: function () {
    return _index.decorateConstants;
  }
});
Object.defineProperty(exports, "decorateErrors", {
  enumerable: true,
  get: function () {
    return _index2.decorateErrors;
  }
});
Object.defineProperty(exports, "decorateEvents", {
  enumerable: true,
  get: function () {
    return _index3.decorateEvents;
  }
});
Object.defineProperty(exports, "decorateExtrinsics", {
  enumerable: true,
  get: function () {
    return _index4.decorateExtrinsics;
  }
});
Object.defineProperty(exports, "decorateStorage", {
  enumerable: true,
  get: function () {
    return _index5.decorateStorage;
  }
});

var _util = require("@polkadot/util");

var _Metadata = require("../Metadata.cjs");

var _index = require("./constants/index.cjs");

var _index2 = require("./errors/index.cjs");

var _index3 = require("./events/index.cjs");

var _index4 = require("./extrinsics/index.cjs");

var _index5 = require("./storage/index.cjs");

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Expands the metadata by decoration into consts, query and tx sections
 */
function expandMetadata(registry, metadata) {
  (0, _util.assert)(metadata instanceof _Metadata.Metadata, 'You need to pass a valid Metadata instance to Decorated');
  const latest = metadata.asLatest;
  const version = metadata.version;
  return {
    consts: (0, _index.decorateConstants)(registry, latest, version),
    errors: (0, _index2.decorateErrors)(registry, latest, version),
    events: (0, _index3.decorateEvents)(registry, latest, version),
    query: (0, _index5.decorateStorage)(registry, latest, version),
    tx: (0, _index4.decorateExtrinsics)(registry, latest, version)
  };
}