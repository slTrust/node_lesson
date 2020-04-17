var assert = require('assert');
describe('JS的数组', function() {
  it('arr = [], arr.length === 0', function() {
    assert.equal([].length, 0);
  });

  it('arr = [], arr.push(2)后 length =1  ，arr[0] =2', function() {
    let arr = [];
    arr.push(2);
    assert.equal(arr.length, 1);
    assert.equal(arr[0],2);
  });
});