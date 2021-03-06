import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classPrivateFieldLooseBase from "@babel/runtime/helpers/esm/classPrivateFieldLooseBase";
import _classPrivateFieldLooseKey from "@babel/runtime/helpers/esm/classPrivateFieldLooseKey";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-var-requires */
import { assert, assertReturn, BN_ZERO, formatBalance, isFunction, isString, isU8a, logger, stringCamelCase, stringify, u8aToHex } from '@polkadot/util';
import { blake2AsU8a } from '@polkadot/util-crypto';
import { DoNotConstruct } from "../codec/DoNotConstruct.js";
import { Json } from "../codec/Json.js";
import { Raw } from "../codec/Raw.js";
import { expandExtensionTypes, fallbackExtensions, findUnknownExtensions } from "../extrinsic/signedExtensions/index.js";
import { GenericEventData } from "../generic/Event.js";
import * as baseTypes from "../index.types.js";
import * as definitions from "../interfaces/definitions.js";
import { decorateConstants, decorateExtrinsics } from "../metadata/decorate/index.js";
import { Metadata } from "../metadata/Metadata.js";
import { createClass, getTypeClass } from "./createClass.js";
import { createTypeUnsafe } from "./createType.js";
import { getTypeDef } from "./getTypeDef.js";
const l = logger('registry'); // create error mapping from metadata

function injectErrors(_, metadata, metadataErrors) {
  const modules = metadata.asLatest.modules; // decorate the errors

  modules.forEach(({
    errors,
    index,
    name
  }, _sectionIndex) => {
    const sectionIndex = metadata.version >= 12 ? index.toNumber() : _sectionIndex;
    const sectionName = stringCamelCase(name);
    errors.forEach(({
      docs,
      name
    }, index) => {
      const eventIndex = new Uint8Array([sectionIndex, index]);
      metadataErrors[u8aToHex(eventIndex)] = {
        docs: docs.map(d => d.toString()),
        index,
        method: name.toString(),
        name: name.toString(),
        section: sectionName
      };
    });
  });
} // create event classes from metadata


function injectEvents(registry, metadata, metadataEvents) {
  // decorate the events
  metadata.asLatest.modules.filter(({
    events
  }) => events.isSome).forEach(({
    events,
    index,
    name
  }, _sectionIndex) => {
    const sectionIndex = metadata.version >= 12 ? index.toNumber() : _sectionIndex;
    const sectionName = stringCamelCase(name);
    events.unwrap().forEach((meta, methodIndex) => {
      const methodName = meta.name.toString();
      const typeDef = meta.args.map(arg => getTypeDef(arg));
      let Types = null; // Lazy create the actual type classes right at the point of use

      const getTypes = () => {
        if (!Types) {
          Types = typeDef.map(typeDef => getTypeClass(registry, typeDef));
        }

        return Types;
      };

      metadataEvents[u8aToHex(new Uint8Array([sectionIndex, methodIndex]))] = class extends GenericEventData {
        constructor(registry, value) {
          super(registry, value, getTypes(), typeDef, meta, sectionName, methodName);
        }

      };
    });
  });
} // create extrinsic mapping from metadata


function injectExtrinsics(registry, metadata, metadataCalls) {
  const extrinsics = decorateExtrinsics(registry, metadata.asLatest, metadata.version); // decorate the extrinsics

  Object.values(extrinsics).forEach(methods => Object.values(methods).forEach(method => {
    metadataCalls[u8aToHex(method.callIndex)] = method;
  }));
} // extract additional properties from the metadata


function extractProperties(registry, metadata) {
  var _constants$system;

  const original = registry.getChainProperties();
  const constants = decorateConstants(registry, metadata.asLatest, metadata.version);
  const ss58Format = (_constants$system = constants.system) === null || _constants$system === void 0 ? void 0 : _constants$system.ss58Prefix;

  if (!ss58Format) {
    return original;
  }

  const {
    tokenDecimals,
    tokenSymbol
  } = original || {};
  return registry.createType('ChainProperties', {
    ss58Format,
    tokenDecimals,
    tokenSymbol
  });
}

var _classes = /*#__PURE__*/_classPrivateFieldLooseKey("classes");

var _definitions = /*#__PURE__*/_classPrivateFieldLooseKey("definitions");

var _metadata = /*#__PURE__*/_classPrivateFieldLooseKey("metadata");

var _metadataCalls = /*#__PURE__*/_classPrivateFieldLooseKey("metadataCalls");

var _metadataErrors = /*#__PURE__*/_classPrivateFieldLooseKey("metadataErrors");

var _metadataEvents = /*#__PURE__*/_classPrivateFieldLooseKey("metadataEvents");

var _unknownTypes = /*#__PURE__*/_classPrivateFieldLooseKey("unknownTypes");

var _chainProperties = /*#__PURE__*/_classPrivateFieldLooseKey("chainProperties");

var _hasher = /*#__PURE__*/_classPrivateFieldLooseKey("hasher");

var _knownDefaults = /*#__PURE__*/_classPrivateFieldLooseKey("knownDefaults");

var _knownDefinitions = /*#__PURE__*/_classPrivateFieldLooseKey("knownDefinitions");

var _knownTypes = /*#__PURE__*/_classPrivateFieldLooseKey("knownTypes");

var _signedExtensions = /*#__PURE__*/_classPrivateFieldLooseKey("signedExtensions");

var _userExtensions = /*#__PURE__*/_classPrivateFieldLooseKey("userExtensions");

export class TypeRegistry {
  constructor(createdAtHash) {
    Object.defineProperty(this, _classes, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _definitions, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _metadata, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _metadataCalls, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _metadataErrors, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _metadataEvents, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _unknownTypes, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _chainProperties, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _hasher, {
      writable: true,
      value: blake2AsU8a
    });
    Object.defineProperty(this, _knownDefaults, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _knownDefinitions, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _knownTypes, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _signedExtensions, {
      writable: true,
      value: fallbackExtensions
    });
    Object.defineProperty(this, _userExtensions, {
      writable: true,
      value: void 0
    });
    this.createdAtHash = void 0;
    _classPrivateFieldLooseBase(this, _knownDefaults)[_knownDefaults] = _objectSpread({
      Json,
      Metadata,
      Raw
    }, baseTypes);
    _classPrivateFieldLooseBase(this, _knownDefinitions)[_knownDefinitions] = definitions;
    this.init();

    if (createdAtHash) {
      this.createdAtHash = this.createType('Hash', createdAtHash);
    }
  }

  init() {
    // start clean
    _classPrivateFieldLooseBase(this, _classes)[_classes] = new Map();
    _classPrivateFieldLooseBase(this, _definitions)[_definitions] = new Map();
    _classPrivateFieldLooseBase(this, _unknownTypes)[_unknownTypes] = new Map();
    _classPrivateFieldLooseBase(this, _knownTypes)[_knownTypes] = {}; // register know, first classes then on-demand-created definitions

    this.register(_classPrivateFieldLooseBase(this, _knownDefaults)[_knownDefaults]);
    Object.values(_classPrivateFieldLooseBase(this, _knownDefinitions)[_knownDefinitions]).forEach(({
      types
    }) => this.register(types));
    return this;
  }

  get chainDecimals() {
    var _classPrivateFieldLoo;

    if ((_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _chainProperties)[_chainProperties]) !== null && _classPrivateFieldLoo !== void 0 && _classPrivateFieldLoo.tokenDecimals.isSome) {
      const allDecimals = _classPrivateFieldLooseBase(this, _chainProperties)[_chainProperties].tokenDecimals.unwrap();

      if (allDecimals.length) {
        return allDecimals.map(b => b.toNumber());
      }
    }

    return [12];
  }

  get chainSS58() {
    var _classPrivateFieldLoo2;

    return (_classPrivateFieldLoo2 = _classPrivateFieldLooseBase(this, _chainProperties)[_chainProperties]) !== null && _classPrivateFieldLoo2 !== void 0 && _classPrivateFieldLoo2.ss58Format.isSome ? _classPrivateFieldLooseBase(this, _chainProperties)[_chainProperties].ss58Format.unwrap().toNumber() : undefined;
  }

  get chainTokens() {
    var _classPrivateFieldLoo3;

    if ((_classPrivateFieldLoo3 = _classPrivateFieldLooseBase(this, _chainProperties)[_chainProperties]) !== null && _classPrivateFieldLoo3 !== void 0 && _classPrivateFieldLoo3.tokenSymbol.isSome) {
      const allTokens = _classPrivateFieldLooseBase(this, _chainProperties)[_chainProperties].tokenSymbol.unwrap();

      if (allTokens.length) {
        return allTokens.map(s => s.toString());
      }
    }

    return [formatBalance.getDefaults().unit];
  }
  /**
   * @description Returns tru if the type is in a Compat format
   */


  isLookupType(value) {
    return /Lookup\d+$/.test(value);
  }
  /**
   * @description Creates a lookup string from the supplied id
   */


  createLookupType(lookupId) {
    return `Lookup${lookupId.toString()}`;
  }

  get knownTypes() {
    return _classPrivateFieldLooseBase(this, _knownTypes)[_knownTypes];
  }

  get lookup() {
    throw new Error('Unimplemented'); // return this.metadata.lookup;
  }

  get metadata() {
    assert(_classPrivateFieldLooseBase(this, _metadata)[_metadata], 'Metadata has not been set on this registry');
    return _classPrivateFieldLooseBase(this, _metadata)[_metadata];
  }

  get unknownTypes() {
    return [..._classPrivateFieldLooseBase(this, _unknownTypes)[_unknownTypes].keys()];
  }

  get signedExtensions() {
    return _classPrivateFieldLooseBase(this, _signedExtensions)[_signedExtensions];
  }
  /**
   * @describe Creates an instance of the class
   */


  createClass(type) {
    return createClass(this, type);
  }
  /**
   * @description Creates an instance of a type as registered
   */


  createType(type, ...params) {
    return createTypeUnsafe(this, type, params);
  }
  /**
   * @description Creates an instance of a type as registered
   */


  createTypeUnsafe(type, params, options) {
    return createTypeUnsafe(this, type, params, options);
  } // find a specific call


  findMetaCall(callIndex) {
    const hexIndex = u8aToHex(callIndex);
    return assertReturn(_classPrivateFieldLooseBase(this, _metadataCalls)[_metadataCalls][hexIndex], `findMetaCall: Unable to find Call with index ${hexIndex}/[${callIndex.toString()}]`);
  } // finds an error


  findMetaError(errorIndex) {
    const hexIndex = u8aToHex(isU8a(errorIndex) ? errorIndex : new Uint8Array([errorIndex.index.toNumber(), errorIndex.error.toNumber()]));
    return assertReturn(_classPrivateFieldLooseBase(this, _metadataErrors)[_metadataErrors][hexIndex], `findMetaError: Unable to find Error with index ${hexIndex}/[${errorIndex.toString()}]`);
  }

  findMetaEvent(eventIndex) {
    const hexIndex = u8aToHex(eventIndex);
    return assertReturn(_classPrivateFieldLooseBase(this, _metadataEvents)[_metadataEvents][hexIndex], `findMetaEvent: Unable to find Event with index ${hexIndex}/[${eventIndex.toString()}]`);
  }

  get(name, withUnknown) {
    let Type = _classPrivateFieldLooseBase(this, _classes)[_classes].get(name); // we have not already created the type, attempt it


    if (!Type) {
      const definition = _classPrivateFieldLooseBase(this, _definitions)[_definitions].get(name);

      let BaseType; // we have a definition, so create the class now (lazily)

      if (definition) {
        BaseType = createClass(this, definition);
      } else if (withUnknown) {
        l.warn(`Unable to resolve type ${name}, it will fail on construction`);

        _classPrivateFieldLooseBase(this, _unknownTypes)[_unknownTypes].set(name, true);

        BaseType = DoNotConstruct.with(name);
      }

      if (BaseType) {
        // NOTE If we didn't extend here, we would have strange artifacts. An example is
        // Balance, with this, new Balance() instanceof u128 is true, but Balance !== u128
        // Additionally, we now pass through the registry, which is a link to ourselves
        Type = class extends BaseType {};

        _classPrivateFieldLooseBase(this, _classes)[_classes].set(name, Type);
      }
    }

    return Type;
  }

  getChainProperties() {
    return _classPrivateFieldLooseBase(this, _chainProperties)[_chainProperties];
  }

  getClassName(clazz) {
    const entry = [..._classPrivateFieldLooseBase(this, _classes)[_classes].entries()].find(([, test]) => test === clazz);
    return entry ? entry[0] : undefined;
  }

  getDefinition(typeName) {
    return _classPrivateFieldLooseBase(this, _definitions)[_definitions].get(typeName);
  }

  getModuleInstances(specName, moduleName) {
    var _classPrivateFieldLoo4, _classPrivateFieldLoo5, _classPrivateFieldLoo6, _classPrivateFieldLoo7, _classPrivateFieldLoo8;

    return (_classPrivateFieldLoo4 = _classPrivateFieldLooseBase(this, _knownTypes)[_knownTypes]) === null || _classPrivateFieldLoo4 === void 0 ? void 0 : (_classPrivateFieldLoo5 = _classPrivateFieldLoo4.typesBundle) === null || _classPrivateFieldLoo5 === void 0 ? void 0 : (_classPrivateFieldLoo6 = _classPrivateFieldLoo5.spec) === null || _classPrivateFieldLoo6 === void 0 ? void 0 : (_classPrivateFieldLoo7 = _classPrivateFieldLoo6[specName]) === null || _classPrivateFieldLoo7 === void 0 ? void 0 : (_classPrivateFieldLoo8 = _classPrivateFieldLoo7.instances) === null || _classPrivateFieldLoo8 === void 0 ? void 0 : _classPrivateFieldLoo8[moduleName];
  }

  getOrThrow(name, msg) {
    return assertReturn(this.get(name), msg || `type ${name} not found`);
  }

  getOrUnknown(name) {
    return this.get(name, true);
  }

  getSignedExtensionExtra() {
    return expandExtensionTypes(_classPrivateFieldLooseBase(this, _signedExtensions)[_signedExtensions], 'payload', _classPrivateFieldLooseBase(this, _userExtensions)[_userExtensions]);
  }

  getSignedExtensionTypes() {
    return expandExtensionTypes(_classPrivateFieldLooseBase(this, _signedExtensions)[_signedExtensions], 'extrinsic', _classPrivateFieldLooseBase(this, _userExtensions)[_userExtensions]);
  }

  hasClass(name) {
    return _classPrivateFieldLooseBase(this, _classes)[_classes].has(name);
  }

  hasDef(name) {
    return _classPrivateFieldLooseBase(this, _definitions)[_definitions].has(name);
  }

  hasType(name) {
    return !_classPrivateFieldLooseBase(this, _unknownTypes)[_unknownTypes].get(name) && (this.hasClass(name) || this.hasDef(name));
  }

  hash(data) {
    return this.createType('CodecHash', _classPrivateFieldLooseBase(this, _hasher)[_hasher](data));
  }

  // eslint-disable-next-line no-dupe-class-members
  register(arg1, arg2) {
    // NOTE Constructors appear as functions here
    if (isFunction(arg1)) {
      _classPrivateFieldLooseBase(this, _classes)[_classes].set(arg1.name, arg1);
    } else if (isString(arg1)) {
      assert(isFunction(arg2), () => `Expected class definition passed to '${arg1}' registration`);
      assert(arg1 !== arg2.toString(), () => `Unable to register circular ${arg1} === ${arg1}`);

      _classPrivateFieldLooseBase(this, _classes)[_classes].set(arg1, arg2);
    } else {
      this._registerObject(arg1);
    }
  }

  _registerObject(obj) {
    Object.entries(obj).forEach(([name, type]) => {
      if (isFunction(type)) {
        // This _looks_ a bit funny, but `typeof Clazz === 'function'
        _classPrivateFieldLooseBase(this, _classes)[_classes].set(name, type);
      } else {
        const def = isString(type) ? type : stringify(type);
        assert(name !== def, () => `Unable to register circular ${name} === ${def}`); // we already have this type, remove the classes registered for it

        if (_classPrivateFieldLooseBase(this, _classes)[_classes].has(name)) {
          _classPrivateFieldLooseBase(this, _classes)[_classes].delete(name);
        }

        _classPrivateFieldLooseBase(this, _definitions)[_definitions].set(name, def);
      }
    });
  } // sets the chain properties


  setChainProperties(properties) {
    if (properties) {
      _classPrivateFieldLooseBase(this, _chainProperties)[_chainProperties] = properties;
    }
  }

  setHasher(hasher) {
    _classPrivateFieldLooseBase(this, _hasher)[_hasher] = hasher || blake2AsU8a;
  }

  setKnownTypes(knownTypes) {
    _classPrivateFieldLooseBase(this, _knownTypes)[_knownTypes] = knownTypes;
  } // sets the metadata


  setMetadata(metadata, signedExtensions, userExtensions) {
    _classPrivateFieldLooseBase(this, _metadata)[_metadata] = metadata.asLatest;
    injectExtrinsics(this, metadata, _classPrivateFieldLooseBase(this, _metadataCalls)[_metadataCalls]);
    injectErrors(this, metadata, _classPrivateFieldLooseBase(this, _metadataErrors)[_metadataErrors]);
    injectEvents(this, metadata, _classPrivateFieldLooseBase(this, _metadataEvents)[_metadataEvents]); // setup the available extensions

    this.setSignedExtensions(signedExtensions || (metadata.asLatest.extrinsic.version.gt(BN_ZERO) ? metadata.asLatest.extrinsic.signedExtensions.map(key => key.toString()) : fallbackExtensions), userExtensions); // setup the chain properties with format overrides

    this.setChainProperties(extractProperties(this, metadata));
  } // sets the available signed extensions


  setSignedExtensions(signedExtensions = fallbackExtensions, userExtensions) {
    _classPrivateFieldLooseBase(this, _signedExtensions)[_signedExtensions] = signedExtensions;
    _classPrivateFieldLooseBase(this, _userExtensions)[_userExtensions] = userExtensions;
    const unknown = findUnknownExtensions(_classPrivateFieldLooseBase(this, _signedExtensions)[_signedExtensions], _classPrivateFieldLooseBase(this, _userExtensions)[_userExtensions]);

    if (unknown.length) {
      l.warn(`Unknown signed extensions ${unknown.join(', ')} found, treating them as no-effect`);
    }
  }

}