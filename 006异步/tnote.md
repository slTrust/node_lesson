### Node.js中的异步

Node.js风格回调：

```
function foo(params, callback) {
   if(!params) callback(new Error('INVALID PARAMS'));
   else callback(null, 'Great!');
}

foo({}, (err, result)=> {
    if(err) console.log(err); // null
    if(result) console.log(result); // Great!
})
```

Node.js约定，回调函数中第一个参数为错误，第二个参数（及以后）为返回的结果

在Node.js中，底层提供的几乎所有IO相关的操作，比如读写数据库，读写磁盘，发出或接受网络请求，都是异步的，即便提供同步版本，也多为测试等考量。

异步IO是Node.js的特点和性能基础，使其能够接受更大的并发

### Node.js异步带来的问题

回调的写法使得回调链上的耦合比较强，变得难以独立修改
比如如下逻辑（ABCDE均为异步函数）,如果A的结果为成功，调用B，否则调用C，如果B调用成功调用C，否则调用D，D成功则调用E
使用Node.js回调方式实现上述逻辑

```
function Foo(cb) {
  A((err) => {
    if (!err) {
      B((err) => {
        if (!err) {
          C((err) => {
            cb(null)
          })
        } else {
          D((err) => {
            if (err) {
              E((err) => {
              })
            }
          })
        }
      })
    } else {
      C(err => {
        cb(null)
      })
    }
  })
}
```

以最简形式写出依旧灰常不清晰

而如果上述方法都是同步方法，该流程会变成这样：

```
let resultA = A();
if (resultA) {
  let resultB = B()
  if (resultB) {
    C()
  } else {
    let resultD = D()
    if (resultD) {
      E()
    }
  }
} else {
  C();
}
```

由异步带来的过度嵌套会让流程变得非常复杂。大家可以自行写一下上述流程实验一番
第二例中的写法其实也是目前社区较为认可的异步处理方式，即，像写同步一样写异步

### async/await

在ES2017标准中新加入的async/await就是上文中所述处理方式的具体形式
改造上述方法时只需要注意三点：

1. 最外层函数应该使用async关键字修饰
2. 异步函数应该以promise形式包装
3. 异步函数调用的结果前，应该加上await关键字

```
async function() {
    let resultA = await A();
    if (resultA) {
      let resultB = await B()
      if (resultB) {
         await C()
      } else {
        let resultD = await D()
        if (resultD) {
          await E()
        }
      }
    } else {
      await C();
    }
}
```

接下来我们进入Promise

### Promise

```
let p = new Promise((resolve, reject)=>{
  resolve('duang')
})

p.then(r=>{
  console.log(r);
});
```

相当于下面的

```
function foo(cb) {
  cb('duang')
}

foo((r)=>{
  console.log(r)
})
```

Promise中，then函数同样也会返回一个Promise，使得串联的.then().then()成为可能

```
let p = new Promise((resolve, reject)=>{
  resolve(1)
})

let p2 = p.then(r=>{
  console.log(r);
  return new Promise((rl,rj)=>{
    rl(2)
  })
})

let p3 = p2.then(r=>{
  console.log(r);
})
```

Promise的出现使得回调从多层变成了一层，但是其在有分支的流程上依旧略显不足

### 流程控制

使用Node.js回调风格时，可以使用 Async.js 进行流程控制，其提供的流程控制函数通过组合，可以解决大多数流程控制繁杂的问题
但是由于其对Promise的使用并不算非常友好，本教程中如果混用反而会造成疑惑，故本教程中不选择使用，大家可以自行阅读文档，对这个强大的工具有一个初步了解

之前使用过的bluebird也提供了一系列的流程控制函数，比如

```
Promise.all([p1,p2,p3]) //原生Promise也有
Promise.race([p1,p2]) //采取先返回的Promise执行结果
Promise.some
Promise.any
```

活用上述方法可以使流程更加高效和便于维护

值得一提的是Promise.all方法，当你有多个任务需要执行，且任务间没有结果依赖的话，调用该方法可以让任务并行执行
在这里特别注意，async/await 固然好用，但是不能不假思索地用

另外提出一个问题：如果有多次同一个表的数据库更新操作，应该用以上哪个方法？