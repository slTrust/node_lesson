### 错误处理

在我们自己搭建的Node.js服务中，产生错误是很常见的。开发环境下我们可以通过在对应位置添加断点的方式调试，也可以在console.log中打印出关键信息以定位问题
但是生产环境中的错误处理和调试就会比较麻烦：
首先，对服务高稳定性的需求导致我们不能把服务器中的代码打上断点慢慢调试，这样服务器的相应会被阻塞
其次，在不确定错误产生的地点时，一点点增加console.log的深度然后不断重启服务显然不限时
再者，使用我们服务的用户应该尽快地知道有错误发生，并且收到相应的解决方案

这就对服务器的错误处理和记录提出了一些要求
1.错误必须在合适的地方被抛出，便于我们快速定位是哪一行代码出了问题
2.产生错误时，必须要做一些及时的处理，保证服务器能够对这次请求产生合适的相应

### Node.js中的错误（异常）

创建一个错误对象

```
new Error('oops')
```
或者使用V8提供的接口

```
const obj = {message:'oops'} // 可以手动指定message和name属性
Error.captureStackTrace(obj)
```

抛出一个错误

```
throw Error('oops')
```

在同步代码中捕获一个错误

```
try {
  throw Error('error in try-catch')
}
catch(e){
  console.log(e.message);
  throw e;
}
```

在async/await代码中捕获一个错误

```
async function bar () {
  throw new Error('error in bar')
}

(async () => {
  await bar()
})().then(r => {
}).catch(e => {
  console.log(e);
})
```

或者

```
async function bar () {
  throw new Error('error in bar')
}

(async () => {
  try{
    await bar()
  }catch(e){
    console.log(e);
  }
})
().then(r => {
}).catch(e => {
})
```

但是如果试图在async函数外用try/catch

```
async function bar () {
  throw new Error('error in bar')
}

try{
  (async () => {
    await bar()
  })()
}catch(e){
  console.log(e);
}
```

你会收获一份unhandledRejection

在Node.js风格回调中，错误处理应该是这个画风

```
function foo (cb) {
  cb(new Error('error in callback'))
}

foo((e)=>{
  console.log(e);
})
```

#### 关于unhandledRejection和uncaughtException

如果在promise中抛出了一个异常，却没有被.catch拦截，就会出现unhandledRejection
如果出现了一个exception，却没有被try/catch包裹住，则会出现uncaughtException

```
new Promise((rl,rj)=>{
    throw new Error('will cause unhandled rejection')
})
```

我们需要这样处理

```
process.on('unhandledRejection',(p,reason)=>{

})
```

如果是uncaughtException，则应该

```
process.on('uncaughtException', (e)=>{
  console.log(e);
})

undefined.name;
```

### HTTP请求的异常处理和自定义错误码

如果在一次HTTP请求中，有错误被产生，应该立即返回这次请求，并附上相应的错误码和提示信息
我们使用拓展过的Error类来实现这个效果

定义一个Error对象

```
class HTTPBaseError extends Error {
  constructor(httpStatusCode, httpMsg, errCode, msg) {
    super(`HTTP ERROR: ${msg}`);
    this.httpStatusCode = httpStatusCode;
    this.httpMsg = httpMsg;
    this.errCode = errCode;
  }
}

throw new HTTPBaseError(500, '出错啦' ,100001, 'internal_server_error')
```

### 日志处理

在关于错误处理的部分中我们提到了，应该在正确的的位置将错误对应的内容打印下来
然而在Node.js中，如果我们直接使用console.log来打印错误，是不太好的
首先，如果不重定向console.log到文件，那么日志并没有被持久化，这肯定是不行滴
其次，Node.js的console.log的输出，会根据输出的目的对象，有可能进行同步输出，会阻塞进程

我们将会使用winston来进行日志处理

#### Winston

异步（重点在此）Node.js日志库，有多文件多等级输出功能
接下来讲一下配置

#### Transport

Winston可以对日志根据等级(比如verbose、debug、error)将日志分类并输出到不同的文件中

```
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'filelog-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({C
      name: 'error-file',
      filename: 'filelog-error.log',
      level: 'error'
    })
  ]
});
```

transports可以进行动态地添加和删除，比如我们在调试时可能需要将所有日志打印到console中
可以

```
logger.add(winston.transports.Console);
```

#### 日志滚动

随着服务的运行，日志会越来越大，如果不做管理，迟早会导致服务器磁盘被塞满

我们使用npm上的winston-daily-rotate-file进行日志滚动

```
  var winston = require('winston');
  require('winston-daily-rotate-file');

  var transport = new (winston.transports.DailyRotateFile)({
    filename: './log',
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: process.env.ENV === 'development' ? 'debug' : 'info'
  });

  var logger = new (winston.Logger)({
    transports: [
      transport
    ]
  });
```