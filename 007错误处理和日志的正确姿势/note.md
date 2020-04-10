### 错误处理

> `undefined.xxx()`

```
undefined.xxx();
```

> throw

```
throw new Error('something went wrong')
```

> captureStackTrace

```
const obj = {
    message: 'something went wrong'
};
Error.captureStackTrace(obj);
throw obj;
```

> try / catch

```
try {
    throw new Error('oh no!')
} catch (e){
    console.log(e)
}
```

#### callBack 异常处理

```
function foo(param, cb){
  const error = new Error('something wrong async')
  if(error) cb(error)
}

foo({},(err,result)=>{
    if(err){
        console.log(err)
    }
})
```

#### async 函数的异常处理

```
async function foo2(){
  throw new Error('async function wrong')
}

foo2()
  .catch(e=>{
      console.log(e)
  })
```

or

```
async function foo3(){
  try {
    await bar();
  }catch(e){
    console.log(e)
  }
}

async function bar(){
  throw new Error('async function wrong2')
}

foo3()
```

分阶段处理异常

```
// 分阶段处理
async function foo4(){
  await bar().catch(e=>{
      console.log('bar catch err')
      throw e;
  });
}
  
async function bar(){
  throw new Error('async function wrong2')
}

foo4()
  .catch(e=>{
    console.log('foo4 catch err')
  })
  
```

### winston 日志模块使用

- [文档](https://www.npmjs.com/package/winston)
- 安装如下依赖
```
"winston": "^2.4.0",
```

> 使用 winston

- 同文件目录新建 "logs"文件夹

```
const winston = require('winston');
const { Logger, transports } = winston;
const logger = new Logger({
    transports: [
        new (transports.File)({
            name: 'info_logger',
            filename: 'logs/info.log',
            level: 'info'
        }),
        new (transports.Console)(),
    ]
});

// 高于 info级别也会被记录在 logs/info.log 里
logger.info('my first log info msg ')
logger.error('my first log error msg ')


const logger2 = new Logger({
    transports: [
        new (transports.File)({
            name: 'error_logger',
            filename: 'logs/error2.log',
            level: 'error'
        }),
        new (transports.Console)(),
    ]
});
// 只有 error级别被记录在 logs/error2.log 里
logger2.info('my first logger2 info msg ');
logger2.error('my first logger2 error msg ');



const logger3 = new Logger({
    transports: [
        new (transports.File)({
            name: 'info_logger',
            filename: 'logs/info3.log',
            level: 'info'
        }),
        new (transports.File)({
            name: 'error_logger',
            filename: 'logs/error3.log',
            level: 'error'
        }),
        new (transports.Console)(),
    ]
});

// 高于等于info级别记录在 logs/info3.log里， error级别 记录在 logs/error3.log 里
logger3.info('my first logger3 info msg ');
logger3.error('my first logger3 error msg ');
```

#### 日志滚动

- log rotation
- 安装依赖 "winston-daily-rotate-file": "^1.7.2"

随着服务的运行，日志会越来越大，如果不做管理，迟早会导致服务器磁盘被塞满

我们使用npm上的winston-daily-rotate-file进行日志滚动

```
const winston = require('winston');
require('winston-daily-rotate-file');

const { Logger, transports } = winston;

const reqLogger = new Logger({
    transports: [
        new (transports.Console)(),
        new transports.DailyRotateFile({
            filename: './logs/.req_log.log',
            datePattern: 'yyyy_MM_dd',
            prepend: true, // 代表日期在作为前缀还是后缀
            level: 'info',
        })
    ]
});

reqLogger.info('request my client');
```

#### 代码仓库

- [express引入错误处理和日志模块](https://github.com/slTrust/express-demo/tree/f6cb358d43d69abdb4e67e557bc32d0066a82aee)
