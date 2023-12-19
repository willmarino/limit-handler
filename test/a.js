/**
 * Testing out test script, this is straight from mocha's docs
 */

var assert = require('assert');
describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', async function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});