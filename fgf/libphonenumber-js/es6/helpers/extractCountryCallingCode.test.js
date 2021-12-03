import extractCountryCallingCode from './extractCountryCallingCode';
import metadata from '../../metadata.min.json';
describe('extractCountryCallingCode', function () {
  it('should extract country calling code from a number', function () {
    extractCountryCallingCode('+78005553535', null, null, metadata).should.deep.equal({
      countryCallingCode: '7',
      number: '8005553535'
    });
    extractCountryCallingCode('+7800', null, null, metadata).should.deep.equal({
      countryCallingCode: '7',
      number: '800'
    });
    extractCountryCallingCode('', null, null, metadata).should.deep.equal({});
  });
});
//# sourceMappingURL=extractCountryCallingCode.test.js.map