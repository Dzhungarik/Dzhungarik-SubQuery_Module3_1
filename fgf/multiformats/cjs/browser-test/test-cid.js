'use strict';

var OLDCID = require('cids');
var assert = require('assert');
var bytes = require('../src/bytes.js');
require('../src/index.js');
var base58 = require('../src/bases/base58.js');
var base32 = require('../src/bases/base32.js');
var base64 = require('../src/bases/base64.js');
var sha2Browser = require('../src/hashes/sha2-browser.js');
var util = require('util');
var buffer = require('buffer');
var invalidMultihash = require('./fixtures/invalid-multihash.js');
var testThrow = require('./fixtures/test-throw.js');
var cid = require('../src/cid.js');
var varint = require('../src/varint.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var OLDCID__default = /*#__PURE__*/_interopDefaultLegacy(OLDCID);
var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util);

const test = it;
const same = (actual, expected) => {
  if (actual instanceof Uint8Array && expected instanceof Uint8Array) {
    if (buffer.Buffer.compare(buffer.Buffer.from(actual), buffer.Buffer.from(expected)) === 0)
      return;
  }
  return assert__default["default"].deepStrictEqual(actual, expected);
};
const testThrowAny = async fn => {
  try {
    await fn();
  } catch (e) {
    return;
  }
  throw new Error('Test failed to throw');
};
describe('CID', () => {
  describe('v0', () => {
    test('handles B58Str multihash', () => {
      const mhStr = 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n';
      const cid$1 = cid.CID.parse(mhStr);
      same(cid$1.version, 0);
      same(cid$1.code, 112);
      same(cid$1.multihash.bytes, base58.base58btc.baseDecode(mhStr));
      same(cid$1.toString(), mhStr);
    });
    test('create by parts', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(0, 112, hash);
      same(cid$1.code, 112);
      same(cid$1.version, 0);
      same(cid$1.multihash, hash);
      same(cid$1.toString(), base58.base58btc.baseEncode(hash.bytes));
    });
    test('create from multihash', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.decode(hash.bytes);
      same(cid$1.code, 112);
      same(cid$1.version, 0);
      same(cid$1.multihash.digest, hash.digest);
      same({
        ...cid$1.multihash,
        digest: null
      }, {
        ...hash,
        digest: null
      });
      cid$1.toString();
      same(cid$1.toString(), base58.base58btc.baseEncode(hash.bytes));
    });
    test('throws on invalid BS58Str multihash ', async () => {
      const msg = 'Non-base58btc character';
      await testThrow(() => cid.CID.parse('QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zIII'), msg);
    });
    test('throws on trying to create a CIDv0 with a codec other than dag-pb', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const msg = 'Version 0 CID must use dag-pb (code: 112) block encoding';
      await testThrow(() => cid.CID.create(0, 113, hash), msg);
    });
    test('throws on trying to base encode CIDv0 in other base than base58btc', async () => {
      const mhStr = 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n';
      const cid$1 = cid.CID.parse(mhStr);
      const msg = 'Cannot string encode V0 in base32 encoding';
      await testThrow(() => cid$1.toString(base32.base32), msg);
    });
    test('.bytes', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const codec = 112;
      const cid$1 = cid.CID.create(0, codec, hash);
      const bytes$1 = cid$1.bytes;
      assert__default["default"].ok(bytes$1);
      const str = bytes.toHex(bytes$1);
      same(str, '1220ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    });
    test('should construct from an old CID', () => {
      const cidStr = 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n';
      const oldCid = cid.CID.parse(cidStr);
      const newCid = cid.CID.asCID(oldCid);
      same(newCid.toString(), cidStr);
    });
    test('inspect bytes', () => {
      const byts = bytes.fromHex('1220ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
      const inspected = cid.CID.inspectBytes(byts.subarray(0, 10));
      same({
        version: 0,
        codec: 112,
        multihashCode: 18,
        multihashSize: 34,
        digestSize: 32,
        size: 34
      }, inspected);
    });
    describe('decodeFirst', () => {
      test('no remainder', () => {
        const byts = bytes.fromHex('1220ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
        const [cid$1, remainder] = cid.CID.decodeFirst(byts);
        same(cid$1.toString(), 'QmatYkNGZnELf8cAGdyJpUca2PyY4szai3RHyyWofNY1pY');
        same(remainder.byteLength, 0);
      });
      test('remainder', () => {
        const byts = bytes.fromHex('1220ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad0102030405');
        const [cid$1, remainder] = cid.CID.decodeFirst(byts);
        same(cid$1.toString(), 'QmatYkNGZnELf8cAGdyJpUca2PyY4szai3RHyyWofNY1pY');
        same(bytes.toHex(remainder), '0102030405');
      });
    });
  });
  describe('v1', () => {
    test('handles CID String (multibase encoded)', () => {
      const cidStr = 'zdj7Wd8AMwqnhJGQCbFxBVodGSBG84TM7Hs1rcJuQMwTyfEDS';
      const cid$1 = cid.CID.parse(cidStr);
      same(cid$1.code, 112);
      same(cid$1.version, 1);
      assert__default["default"].ok(cid$1.multihash);
      same(cid$1.toString(), base32.base32.encode(cid$1.bytes));
    });
    test('handles CID (no multibase)', () => {
      const cidStr = 'bafybeidskjjd4zmr7oh6ku6wp72vvbxyibcli2r6if3ocdcy7jjjusvl2u';
      const cidBuf = buffer.Buffer.from('017012207252523e6591fb8fe553d67ff55a86f84044b46a3e4176e10c58fa529a4aabd5', 'hex');
      const cid$1 = cid.CID.decode(cidBuf);
      same(cid$1.code, 112);
      same(cid$1.version, 1);
      same(cid$1.toString(), cidStr);
    });
    test('create by parts', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(1, 113, hash);
      same(cid$1.code, 113);
      same(cid$1.version, 1);
      assert__default["default"].ok(bytes.equals(cid$1.multihash, hash));
    });
    test('can roundtrip through cid.toString()', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid1 = cid.CID.create(1, 113, hash);
      const cid2 = cid.CID.parse(cid1.toString());
      same(cid1.code, cid2.code);
      same(cid1.version, cid2.version);
      same(cid1.multihash.digest, cid2.multihash.digest);
      same(cid1.multihash.bytes, cid2.multihash.bytes);
      const clear = {
        digest: null,
        bytes: null
      };
      same({
        ...cid1.multihash,
        ...clear
      }, {
        ...cid2.multihash,
        ...clear
      });
    });
    test('.bytes', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const code = 113;
      const cid$1 = cid.CID.create(1, code, hash);
      const bytes$1 = cid$1.bytes;
      assert__default["default"].ok(bytes$1);
      const str = bytes.toHex(bytes$1);
      same(str, '01711220ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    });
    test('should construct from an old CID without a multibaseName', () => {
      const cidStr = 'bafybeidskjjd4zmr7oh6ku6wp72vvbxyibcli2r6if3ocdcy7jjjusvl2u';
      const oldCid = cid.CID.parse(cidStr);
      const newCid = cid.CID.asCID(oldCid);
      same(newCid.toString(), cidStr);
    });
  });
  describe('utilities', () => {
    const h1 = 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n';
    const h2 = 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1o';
    const h3 = 'zdj7Wd8AMwqnhJGQCbFxBVodGSBG84TM7Hs1rcJuQMwTyfEDS';
    test('.equals v0 to v0', () => {
      const cid1 = cid.CID.parse(h1);
      same(cid1.equals(cid.CID.parse(h1)), true);
      same(cid1.equals(cid.CID.create(cid1.version, cid1.code, cid1.multihash)), true);
      const cid2 = cid.CID.parse(h2);
      same(cid1.equals(cid.CID.parse(h2)), false);
      same(cid1.equals(cid.CID.create(cid2.version, cid2.code, cid2.multihash)), false);
    });
    test('.equals v0 to v1 and vice versa', () => {
      const cidV1 = cid.CID.parse(h3);
      const cidV0 = cidV1.toV0();
      same(cidV0.equals(cidV1), false);
      same(cidV1.equals(cidV0), false);
      same(cidV1.multihash, cidV0.multihash);
    });
    test('.equals v1 to v1', () => {
      const cid1 = cid.CID.parse(h3);
      same(cid1.equals(cid.CID.parse(h3)), true);
      same(cid1.equals(cid.CID.create(cid1.version, cid1.code, cid1.multihash)), true);
    });
    test('.isCid', () => {
      assert__default["default"].ok(cid.CID.isCID(cid.CID.parse(h1)));
      assert__default["default"].ok(!cid.CID.isCID(false));
      assert__default["default"].ok(!cid.CID.isCID(buffer.Buffer.from('hello world')));
      assert__default["default"].ok(cid.CID.isCID(cid.CID.parse(h1).toV0()));
      assert__default["default"].ok(cid.CID.isCID(cid.CID.parse(h1).toV1()));
    });
    test('works with deepEquals', () => {
      const ch1 = cid.CID.parse(h1);
      ch1._baseCache.set('herp', 'derp');
      assert__default["default"].deepStrictEqual(ch1, cid.CID.parse(h1));
      assert__default["default"].notDeepStrictEqual(ch1, cid.CID.parse(h2));
    });
  });
  describe('throws on invalid inputs', () => {
    const parse = [
      'hello world',
      'QmaozNR7DZHQK1ZcU9p7QdrshMvXqWK6gpu5rmrkPdT3L'
    ];
    for (const i of parse) {
      const name = `CID.parse(${ JSON.stringify(i) })`;
      test(name, async () => await testThrowAny(() => cid.CID.parse(i)));
    }
    const decode = [
      buffer.Buffer.from('hello world'),
      buffer.Buffer.from('QmaozNR7DZHQK1ZcU9p7QdrshMvXqWK6gpu5rmrkPdT')
    ];
    for (const i of decode) {
      const name = `CID.decode(Buffer.from(${ JSON.stringify(i.toString()) }))`;
      test(name, async () => await testThrowAny(() => cid.CID.decode(i)));
    }
    const create = [
      ...[
        ...parse,
        ...decode
      ].map(i => [
        0,
        112,
        i
      ]),
      ...[
        ...parse,
        ...decode
      ].map(i => [
        1,
        112,
        i
      ]),
      [
        18,
        112,
        'QmaozNR7DZHQK1ZcU9p7QdrshMvXqWK6gpu5rmrkPdT3L'
      ]
    ];
    for (const [version, code, hash] of create) {
      const form = JSON.stringify(hash.toString());
      const mh = buffer.Buffer.isBuffer(hash) ? `Buffer.from(${ form })` : form;
      const name = `CID.create(${ version }, ${ code }, ${ mh })`;
      test(name, async () => await testThrowAny(() => cid.CID.create(version, code, hash)));
    }
    test('invalid fixtures', async () => {
      for (const test of invalidMultihash) {
        const buff = bytes.fromHex(`0171${ test.hex }`);
        assert__default["default"].throws(() => cid.CID.decode(buff), new RegExp(test.message));
      }
    });
  });
  describe('idempotence', () => {
    const h1 = 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n';
    const cid1 = cid.CID.parse(h1);
    const cid2 = cid.CID.asCID(cid1);
    test('constructor accept constructed instance', () => {
      same(cid1 === cid2, true);
    });
  });
  describe('conversion v0 <-> v1', () => {
    test('should convert v0 to v1', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from(`TEST${ Date.now() }`));
      const cid$1 = cid.CID.create(0, 112, hash).toV1();
      same(cid$1.version, 1);
    });
    test('should convert v1 to v0', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from(`TEST${ Date.now() }`));
      const cid$1 = cid.CID.create(1, 112, hash).toV0();
      same(cid$1.version, 0);
    });
    test('should not convert v1 to v0 if not dag-pb codec', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from(`TEST${ Date.now() }`));
      const cid$1 = cid.CID.create(1, 113, hash);
      await testThrow(() => cid$1.toV0(), 'Cannot convert a non dag-pb CID to CIDv0');
    });
    test('should not convert v1 to v0 if not sha2-256 multihash', async () => {
      const hash = await sha2Browser.sha512.digest(buffer.Buffer.from(`TEST${ Date.now() }`));
      const cid$1 = cid.CID.create(1, 112, hash);
      await testThrow(() => cid$1.toV0(), 'Cannot convert non sha2-256 multihash CID to CIDv0');
    });
    test('should return same instance when converting v1 to v1', async () => {
      const hash = await sha2Browser.sha512.digest(buffer.Buffer.from(`TEST${ Date.now() }`));
      const cid$1 = cid.CID.create(1, 112, hash);
      same(cid$1.toV1() === cid$1, true);
    });
    test('should return same instance when converting v0 to v0', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from(`TEST${ Date.now() }`));
      const cid$1 = cid.CID.create(0, 112, hash);
      same(cid$1.toV0() === cid$1, true);
    });
  });
  describe('caching', () => {
    test('should cache CID as buffer', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from(`TEST${ Date.now() }`));
      const cid$1 = cid.CID.create(1, 112, hash);
      assert__default["default"].ok(cid$1.bytes);
      same(cid$1.bytes, cid$1.bytes);
    });
    test('should cache string representation when it matches the multibaseName it was constructed with', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(1, 112, hash);
      same(cid$1._baseCache.size, 0);
      same(cid$1.toString(base64.base64), 'mAXASILp4Fr+PAc/qQUFA3l2uIiOwA2Gjlhd6nLQQ/2HyABWt');
      same(cid$1._baseCache.get(base64.base64.prefix), 'mAXASILp4Fr+PAc/qQUFA3l2uIiOwA2Gjlhd6nLQQ/2HyABWt');
      same(cid$1._baseCache.has(base32.base32.prefix), false);
      const base32String = 'bafybeif2pall7dybz7vecqka3zo24irdwabwdi4wc55jznaq75q7eaavvu';
      same(cid$1.toString(), base32String);
      same(cid$1._baseCache.get(base32.base32.prefix), base32String);
      same(cid$1.toString(base64.base64), 'mAXASILp4Fr+PAc/qQUFA3l2uIiOwA2Gjlhd6nLQQ/2HyABWt');
    });
    test('should cache string representation when constructed with one', () => {
      const base32String = 'bafybeif2pall7dybz7vecqka3zo24irdwabwdi4wc55jznaq75q7eaavvu';
      const cid$1 = cid.CID.parse(base32String);
      same(cid$1._baseCache.get(base32.base32.prefix), base32String);
    });
  });
  test('toJSON()', async () => {
    const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
    const cid$1 = cid.CID.create(1, 112, hash);
    const json = cid$1.toJSON();
    same({
      ...json,
      hash: null
    }, {
      code: 112,
      version: 1,
      hash: null
    });
    assert__default["default"].ok(bytes.equals(json.hash, hash.bytes));
  });
  test('isCID', async () => {
    const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
    const cid$1 = cid.CID.create(1, 112, hash);
    assert__default["default"].strictEqual(OLDCID__default["default"].isCID(cid$1), false);
  });
  test('asCID', async () => {
    const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
    class IncompatibleCID {
      constructor(version, code, multihash) {
        this.version = version;
        this.code = code;
        this.multihash = multihash;
        this.asCID = this;
      }
      get [Symbol.for('@ipld/js-cid/CID')]() {
        return true;
      }
    }
    const version = 1;
    const code = 112;
    const incompatibleCID = new IncompatibleCID(version, code, hash);
    assert__default["default"].ok(cid.CID.isCID(incompatibleCID));
    assert__default["default"].strictEqual(incompatibleCID.toString(), '[object Object]');
    assert__default["default"].strictEqual(typeof incompatibleCID.toV0, 'undefined');
    const cid1 = cid.CID.asCID(incompatibleCID);
    assert__default["default"].ok(cid1 instanceof cid.CID);
    assert__default["default"].strictEqual(cid1.code, code);
    assert__default["default"].strictEqual(cid1.version, version);
    assert__default["default"].ok(bytes.equals(cid1.multihash, hash));
    const cid2 = cid.CID.asCID({
      version,
      code,
      hash
    });
    assert__default["default"].strictEqual(cid2, null);
    const duckCID = {
      version,
      code,
      multihash: hash
    };
    duckCID.asCID = duckCID;
    const cid3 = cid.CID.asCID(duckCID);
    assert__default["default"].ok(cid3 instanceof cid.CID);
    assert__default["default"].strictEqual(cid3.code, code);
    assert__default["default"].strictEqual(cid3.version, version);
    assert__default["default"].ok(bytes.equals(cid3.multihash, hash));
    const cid4 = cid.CID.asCID(cid3);
    assert__default["default"].strictEqual(cid3, cid4);
    const cid5 = cid.CID.asCID(new OLDCID__default["default"](1, 'raw', buffer.Buffer.from(hash.bytes)));
    assert__default["default"].ok(cid5 instanceof cid.CID);
    assert__default["default"].strictEqual(cid5.version, 1);
    assert__default["default"].ok(bytes.equals(cid5.multihash, hash));
    assert__default["default"].strictEqual(cid5.code, 85);
  });
  const digestsame = (x, y) => {
    same(x.digest, y.digest);
    same(x.hash, y.hash);
    same(x.bytes, y.bytes);
    if (x.multihash) {
      digestsame(x.multihash, y.multihash);
    }
    const empty = {
      hash: null,
      bytes: null,
      digest: null,
      multihash: null
    };
    same({
      ...x,
      ...empty
    }, {
      ...y,
      ...empty
    });
  };
  describe('CID.parse', async () => {
    test('parse 32 encoded CIDv1', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(1, 112, hash);
      const parsed = cid.CID.parse(cid$1.toString());
      digestsame(cid$1, parsed);
    });
    test('parse base58btc encoded CIDv1', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(1, 112, hash);
      const parsed = cid.CID.parse(cid$1.toString(base58.base58btc));
      digestsame(cid$1, parsed);
    });
    test('parse base58btc encoded CIDv0', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(0, 112, hash);
      const parsed = cid.CID.parse(cid$1.toString());
      digestsame(cid$1, parsed);
    });
    test('fails to parse base64 encoded CIDv1', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(1, 112, hash);
      const msg = 'To parse non base32 or base58btc encoded CID multibase decoder must be provided';
      await testThrow(() => cid.CID.parse(cid$1.toString(base64.base64)), msg);
    });
    test('parses base64 encoded CIDv1 if base64 is provided', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(1, 112, hash);
      const parsed = cid.CID.parse(cid$1.toString(base64.base64), base64.base64);
      digestsame(cid$1, parsed);
    });
  });
  test('inspect bytes', () => {
    const byts = bytes.fromHex('01711220ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    const inspected = cid.CID.inspectBytes(byts.subarray(0, 10));
    same({
      version: 1,
      codec: 113,
      multihashCode: 18,
      multihashSize: 34,
      digestSize: 32,
      size: 36
    }, inspected);
    describe('decodeFirst', () => {
      test('no remainder', () => {
        const byts = bytes.fromHex('01711220ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
        const [cid$1, remainder] = cid.CID.decodeFirst(byts);
        same(cid$1.toString(), 'bafyreif2pall7dybz7vecqka3zo24irdwabwdi4wc55jznaq75q7eaavvu');
        same(remainder.byteLength, 0);
      });
      test('remainder', () => {
        const byts = bytes.fromHex('01711220ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad0102030405');
        const [cid$1, remainder] = cid.CID.decodeFirst(byts);
        same(cid$1.toString(), 'bafyreif2pall7dybz7vecqka3zo24irdwabwdi4wc55jznaq75q7eaavvu');
        same(bytes.toHex(remainder), '0102030405');
      });
    });
  });
  test('new CID from old CID', async () => {
    const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
    const cid$1 = cid.CID.asCID(new OLDCID__default["default"](1, 'raw', buffer.Buffer.from(hash.bytes)));
    same(cid$1.version, 1);
    assert__default["default"].ok(bytes.equals(cid$1.multihash, hash));
    same(cid$1.code, 85);
  });
  if (!process.browser) {
    test('util.inspect', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(1, 112, hash);
      same(util__default["default"].inspect(cid$1), 'CID(bafybeif2pall7dybz7vecqka3zo24irdwabwdi4wc55jznaq75q7eaavvu)');
    });
  }
  describe('deprecations', async () => {
    test('codec', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(1, 112, hash);
      await testThrow(() => cid$1.codec, '"codec" property is deprecated, use integer "code" property instead');
      await testThrow(() => cid.CID.create(1, 'dag-pb', hash), 'String codecs are no longer supported');
    });
    test('multibaseName', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(1, 112, hash);
      await testThrow(() => cid$1.multibaseName, '"multibaseName" property is deprecated');
    });
    test('prefix', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(1, 112, hash);
      await testThrow(() => cid$1.prefix, '"prefix" property is deprecated');
    });
    test('toBaseEncodedString()', async () => {
      const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
      const cid$1 = cid.CID.create(1, 112, hash);
      await testThrow(() => cid$1.toBaseEncodedString(), 'Deprecated, use .toString()');
    });
  });
  test('invalid CID version', async () => {
    const encoded = varint.encodeTo(2, new Uint8Array(32));
    await testThrow(() => cid.CID.decode(encoded), 'Invalid CID version 2');
  });
  test('buffer', async () => {
    const hash = await sha2Browser.sha256.digest(buffer.Buffer.from('abc'));
    const cid$1 = cid.CID.create(1, 112, hash);
    await testThrow(() => cid$1.buffer, 'Deprecated .buffer property, use .bytes to get Uint8Array instead');
  });
});
