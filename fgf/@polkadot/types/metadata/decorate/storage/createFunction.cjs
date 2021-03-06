"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFunction = createFunction;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

var _index = require("../../../codec/index.cjs");

var _getHasher = require("./getHasher.cjs");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @internal */
function createKeyRaw(registry, itemFn, keys, hashers, args) {
  return (0, _util.u8aConcat)((0, _utilCrypto.xxhashAsU8a)(itemFn.prefix, 128), (0, _utilCrypto.xxhashAsU8a)(itemFn.method, 128), ...keys.map((type, index) => (0, _getHasher.getHasher)(hashers[index])(registry.createType(type.toString(), args[index]).toU8a())));
}
/** @internal */


function createKey(registry, itemFn, keys, hashers, args) {
  const {
    method,
    section
  } = itemFn;
  (0, _util.assert)(Array.isArray(args), () => `Call to ${(0, _util.stringCamelCase)(section || 'unknown')}.${(0, _util.stringCamelCase)(method || 'unknown')} needs ${keys.length} arguments, provided in tuple format`);
  (0, _util.assert)(args.filter(a => !(0, _util.isUndefined)(a)).length === keys.length, () => `Call to ${(0, _util.stringCamelCase)(section || 'unknown')}.${(0, _util.stringCamelCase)(method || 'unknown')} needs ${keys.length} arguments, found [${args.join(', ')}]`); // as per createKey, always add the length prefix (underlying it is Bytes)

  return (0, _util.compactAddLength)(createKeyRaw(registry, itemFn, keys, hashers, args));
}
/** @internal */


function expandWithMeta({
  meta,
  method,
  prefix,
  section
}, _storageFn) {
  const storageFn = _storageFn;
  storageFn.meta = meta;
  storageFn.method = (0, _util.stringLowerFirst)(method);
  storageFn.prefix = prefix;
  storageFn.section = section; // explicitly add the actual method in the toJSON, this gets used to determine caching and without it
  // instances (e.g. collective) will not work since it is only matched on param meta

  storageFn.toJSON = () => _objectSpread(_objectSpread({}, meta.toJSON()), {}, {
    storage: {
      method,
      prefix,
      section
    }
  });

  return storageFn;
}
/** @internal */


function extendHeadMeta(registry, {
  meta: {
    docs,
    name,
    type
  },
  section
}, {
  method
}, iterFn) {
  const outputType = type.isMap ? type.asMap.key : type.isDoubleMap ? type.asDoubleMap.key1 : type.asNMap.keyVec[0]; // metadata with a fallback value using the type of the key, the normal
  // meta fallback only applies to actual entry values, create one for head

  iterFn.meta = registry.createType('StorageEntryMetadataLatest', {
    docs,
    fallback: registry.createType('Bytes'),
    modifier: registry.createType('StorageEntryModifierLatest', 1),
    // required
    name,
    type: registry.createType('StorageEntryTypeLatest', registry.createType('Type', outputType), 0)
  });
  return (...args) => registry.createType('StorageKey', iterFn(...args), {
    method,
    section
  });
}
/** @internal */


function extendPrefixedMap(registry, itemFn, storageFn) {
  const {
    meta: {
      type
    },
    method,
    section
  } = itemFn;
  storageFn.iterKey = extendHeadMeta(registry, itemFn, storageFn, (...args) => {
    (0, _util.assert)(args.length === 0 || type.isDoubleMap && args.length === 1 || type.isNMap && args.length < type.asNMap.hashers.length, () => `Iteration ${(0, _util.stringCamelCase)(section || 'unknown')}.${(0, _util.stringCamelCase)(method || 'unknown')} needs arguments to be at least one less than the full arguments, found [${args.join(', ')}]`);

    if (args.length) {
      if (type.isDoubleMap) {
        return new _index.Raw(registry, createKeyRaw(registry, itemFn, [type.asDoubleMap.key1], [type.asDoubleMap.hasher], args));
      } else if (type.isNMap) {
        let keys = [...type.asNMap.keyVec];
        let hashers = [...type.asNMap.hashers]; // pick the first n entries where n = args.length which is already verified above to be less that the full arguments.

        keys = keys.slice(0, args.length);
        hashers = hashers.slice(0, args.length);
        return new _index.Raw(registry, createKeyRaw(registry, itemFn, keys, hashers, args));
      }
    }

    return new _index.Raw(registry, createKeyRaw(registry, itemFn, [], [], []));
  });
  return storageFn;
}
/** @internal */


function createFunction(registry, itemFn, options) {
  const {
    meta: {
      type
    }
  } = itemFn; // Can only have zero or one argument:
  //   - storage.system.account(address)
  //   - storage.timestamp.blockPeriod()
  // For higher-map queries the params are passed in as an tuple, [key1, key2]

  const storageFn = expandWithMeta(itemFn, arg => type.isPlain ? options.skipHashing ? (0, _util.compactAddLength)((0, _util.u8aToU8a)(options.key)) : createKey(registry, itemFn, [], [], []) : type.isMap ? createKey(registry, itemFn, [type.asMap.key], [type.asMap.hasher], [arg]) : type.isDoubleMap ? createKey(registry, itemFn, [type.asDoubleMap.key1, type.asDoubleMap.key2], [type.asDoubleMap.hasher, type.asDoubleMap.key2Hasher], arg) : createKey(registry, itemFn, type.asNMap.keyVec, type.asNMap.hashers, arg));

  if (type.isMap || type.isDoubleMap || type.isNMap) {
    extendPrefixedMap(registry, itemFn, storageFn);
  }

  storageFn.keyPrefix = (...args) => storageFn.iterKey && storageFn.iterKey(...args) || (0, _util.compactStripLength)(storageFn())[1];

  return storageFn;
}