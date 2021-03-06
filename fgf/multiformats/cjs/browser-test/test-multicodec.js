'use strict';

var bytes = require('../src/bytes.js');
var assert = require('assert');
var raw = require('../src/codecs/raw.js');
var json = require('../src/codecs/json.js');
var testThrow = require('./fixtures/test-throw.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);

const same = assert__default["default"].deepStrictEqual;
const test = it;
describe('multicodec', () => {
  test('encode/decode raw', () => {
    const buff = raw.encode(bytes.fromString('test'));
    same(buff, bytes.fromString('test'));
    same(raw.decode(buff, 'raw'), bytes.fromString('test'));
  });
  test('encode/decode json', () => {
    const buff = json.encode({ hello: 'world' });
    same(buff, bytes.fromString(JSON.stringify({ hello: 'world' })));
    same(json.decode(buff), { hello: 'world' });
  });
  test('raw cannot encode string', async () => {
    await testThrow(() => raw.encode('asdf'), 'Unknown type, must be binary type');
  });
});
