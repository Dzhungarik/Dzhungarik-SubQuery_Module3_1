import mergeArrays from './mergeArrays'

describe('mergeArrays', () => {
	it('should merge arrays', () => {
		mergeArrays([1, 2], [2, 3]).should.deep.equal([1, 2, 3])
	})
})