import {assert} from 'chai';

describe('null', () => {
	it('null should not equal 0', () => {
		assert.isFalse(null==0);
	});
});
