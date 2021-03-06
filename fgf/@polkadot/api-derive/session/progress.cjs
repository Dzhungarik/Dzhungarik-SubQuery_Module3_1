"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.progress = progress;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function createDerive(api, info, [currentSlot, epochIndex, epochOrGenesisStartSlot, activeEraStartSessionIndex]) {
  const epochStartSlot = epochIndex.mul(info.sessionLength).iadd(epochOrGenesisStartSlot);
  const sessionProgress = currentSlot.sub(epochStartSlot);
  const eraProgress = info.currentIndex.sub(activeEraStartSessionIndex).imul(info.sessionLength).iadd(sessionProgress);
  return _objectSpread(_objectSpread({}, info), {}, {
    eraProgress: api.registry.createType('BlockNumber', eraProgress),
    sessionProgress: api.registry.createType('BlockNumber', sessionProgress)
  });
}

function queryAura(api) {
  return api.derive.session.info().pipe((0, _rxjs.map)(info => _objectSpread(_objectSpread({}, info), {}, {
    eraProgress: api.registry.createType('BlockNumber'),
    sessionProgress: api.registry.createType('BlockNumber')
  })));
}

function queryBabe(api) {
  return api.derive.session.info().pipe((0, _rxjs.switchMap)(info => {
    var _api$query$staking;

    return (0, _rxjs.combineLatest)([(0, _rxjs.of)(info), // we may have no staking, but have babe (permissioned)
    (_api$query$staking = api.query.staking) !== null && _api$query$staking !== void 0 && _api$query$staking.erasStartSessionIndex ? api.queryMulti([api.query.babe.currentSlot, api.query.babe.epochIndex, api.query.babe.genesisSlot, [api.query.staking.erasStartSessionIndex, info.activeEra]]) : api.queryMulti([api.query.babe.currentSlot, api.query.babe.epochIndex, api.query.babe.genesisSlot])]);
  }), (0, _rxjs.map)(([info, [currentSlot, epochIndex, genesisSlot, optStartIndex]]) => [info, [currentSlot, epochIndex, genesisSlot, optStartIndex && optStartIndex.isSome ? optStartIndex.unwrap() : api.registry.createType('SessionIndex', 1)]]));
}
/**
 * @description Retrieves all the session and era query and calculates specific values on it as the length of the session and eras
 */


function progress(instanceId, api) {
  return (0, _index.memo)(instanceId, () => api.query.babe ? queryBabe(api).pipe((0, _rxjs.map)(([info, slots]) => createDerive(api, info, slots))) : queryAura(api));
}