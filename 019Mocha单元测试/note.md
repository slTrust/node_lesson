### Mocha
- [英文官网](https://mochajs.org/)
- [mocha中文网](https://mochajs.cn/)

> 安装

- `npm i mocha`

> 伪代码版

```
describe('亚瑟', function() {
  it('它是一个英雄', function() {
  });

  it('它是武器是宝剑', function() {
  });
});
```

> demo版

```
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
```

#### 补充但愿测试版 es

- 请回es 后续章节

### 各种测试问题参考

- [vue造轮子项目 documents的测试章节](https://github.com/slTrust/gulu-test-1/tree/master/documents)
- [react造轮子项目](https://github.com/slTrust/react-gulu-test-4)
- [react造轮子文章总结的测试章节](https://sltrust.github.io/tags/ReactWheels/)
