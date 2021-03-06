"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetadataVersioned = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _util = require("@polkadot/util");

var _index = require("../codec/index.cjs");

var _toV = require("./v9/toV10.cjs");

var _toV2 = require("./v10/toV11.cjs");

var _toV3 = require("./v11/toV12.cjs");

var _toV4 = require("./v12/toV13.cjs");

var _toLatest = require("./v13/toLatest.cjs");

var _MagicNumber = require("./MagicNumber.cjs");

var _index2 = require("./util/index.cjs");

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
const LATEST_VERSION = 13;
/**
 * @name MetadataVersioned
 * @description
 * The versioned runtime metadata as a decoded structure
 */

var _converted = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("converted");

var _assertVersion = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("assertVersion");

var _getVersion = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("getVersion");

var _metadata = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("metadata");

class MetadataVersioned extends _index.Struct {
  constructor(registry, value) {
    super(registry, {
      magicNumber: _MagicNumber.MagicNumber,
      metadata: 'MetadataAll'
    }, value);
    Object.defineProperty(this, _converted, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _assertVersion, {
      writable: true,
      value: version => {
        (0, _util.assert)(this.version <= version, () => `Cannot convert metadata from version ${this.version} to ${version}`);
        return this.version === version;
      }
    });
    Object.defineProperty(this, _getVersion, {
      writable: true,
      value: (version, fromPrev) => {
        const asCurr = `asV${version}`;
        const asPrev = version === 'latest' ? `asV${LATEST_VERSION}` : `asV${version - 1}`;

        if (version !== 'latest' && (0, _classPrivateFieldLooseBase2.default)(this, _assertVersion)[_assertVersion](version)) {
          return (0, _classPrivateFieldLooseBase2.default)(this, _metadata)[_metadata]()[asCurr];
        }

        if (!(0, _classPrivateFieldLooseBase2.default)(this, _converted)[_converted].has(version)) {
          (0, _classPrivateFieldLooseBase2.default)(this, _converted)[_converted].set(version, fromPrev(this.registry, this[asPrev], this.version));
        }

        return (0, _classPrivateFieldLooseBase2.default)(this, _converted)[_converted].get(version);
      }
    });
    Object.defineProperty(this, _metadata, {
      writable: true,
      value: () => {
        return this.get('metadata');
      }
    });
  }

  /**
   * @description Returns the wrapped metadata as a limited calls-only (latest) version
   */
  get asCallsOnly() {
    return new MetadataVersioned(this.registry, {
      magicNumber: this.magicNumber,
      metadata: this.registry.createType('MetadataAll', (0, _index2.toCallsOnly)(this.registry, this.asLatest), this.version)
    });
  }
  /**
   * @description Returns the wrapped metadata as a V9 object
   */


  get asV9() {
    (0, _classPrivateFieldLooseBase2.default)(this, _assertVersion)[_assertVersion](9);

    return (0, _classPrivateFieldLooseBase2.default)(this, _metadata)[_metadata]().asV9;
  }
  /**
   * @description Returns the wrapped values as a V10 object
   */


  get asV10() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _getVersion)[_getVersion](10, _toV.toV10);
  }
  /**
   * @description Returns the wrapped values as a V11 object
   */


  get asV11() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _getVersion)[_getVersion](11, _toV2.toV11);
  }
  /**
   * @description Returns the wrapped values as a V12 object
   */


  get asV12() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _getVersion)[_getVersion](12, _toV3.toV12);
  }
  /**
   * @description Returns the wrapped values as a V13 object
   */


  get asV13() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _getVersion)[_getVersion](13, _toV4.toV13);
  }
  /**
   * @description Returns the wrapped values as a latest version object
   */


  get asLatest() {
    // This is non-existent & latest - applied here to do the module-specific type conversions
    return (0, _classPrivateFieldLooseBase2.default)(this, _getVersion)[_getVersion]('latest', _toLatest.toLatest);
  }
  /**
   * @description The magicNumber for the Metadata (known constant)
   */


  get magicNumber() {
    return this.get('magicNumber');
  }
  /**
   * @description the metadata version this structure represents
   */


  get version() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _metadata)[_metadata]().index;
  }

  getUniqTypes(throwError) {
    return (0, _index2.getUniqTypes)(this.registry, this.asLatest, throwError);
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */


  toJSON() {
    // HACK(y): ensure that we apply the aliases if we have not done so already, this is
    // needed to ensure we have the correct overrides (which is only applied in toLatest)
    // eslint-disable-next-line no-unused-expressions
    this.asLatest;
    return super.toJSON();
  }

}

exports.MetadataVersioned = MetadataVersioned;