### Express

**看这俩个后面就不用看了**
**看这俩个后面就不用看了**
**看这俩个后面就不用看了**

- https://sltrust.github.io/2018/04/26/NODE_002_01Express/
- https://sltrust.github.io/2018/04/27/NODE_002_02Express/

> helloworld

```
const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
```


#### 中间件

```
const express = require('express');
const app = express();

app.get('/', function (req, res, next) {
    console.log('中间件1')
    next();
});

app.get('/', function (req, res, next) {
    console.log('中间件2')
    next();
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
```

- 访问 http://localhost:3000/
- 得到结果
    ```
    中间件1
    中间件2
    ```

#### auth(中间件应用之 auth鉴权)

```
const express = require('express');
const app = express();

function auth (req, res, next) {
    console.log('开始鉴权');
    if(req.query.username === 'hjx'){
        next();
    }else{
        res.end('please to login')
    }
}

app.get('/', auth);

app.get('/', function (req, res) {
    res.send('Hello World!');
});
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
```

- http://localhost:3000/?username=hjx
- http://localhost:3000/

#### 错误中间件

```
app.use(function (err, req, res, next) {});
```

- 某个流程上 抛出错误，就会走到错误中间件里
- http://localhost:3000/

```
const express = require('express');
const app = express();

app.use('/', function (req, res, next) {
    console.log('中间件1')
    next('something wrong');
});

app.use('/', function (req, res) {
    res.end('abc');
});

app.use(function (err, req, res, next) {
    console.log(err);
    res.end(err)
});
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
```

#### body-parser 使用

安装 `npm i body-parser`

```
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

function bodyParse原理(options){
    return function(req,res,next){
        if(options.abc){
            console.log('hi')
        }
        //打印解析后的请求体
        console.log(req.body);
        next();
    }
}
app.use('/',bodyParse原理({abc:true}));

app.use('/',function(req,res){
    res.json(req.body);
});

app.use((err,req,res,next)=>{
    res.end(err);
})

app.listen(3000,()=>{
    console.log('port 3000 is listening!')
});
```
