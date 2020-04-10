const express = require('express');
const JWT = require('jsonwebtoken');
const app = express();

const key = 'fdafasdfsdfdasfds';

app.get('/login', (req, res, next) => {
  const { username } = req.query;
  const user = { username ,expireAt: Date.now().valueOf() + (20*60*1000)};
  const token = JWT.sign(user, key);
  res.send(token);
});
  
app.get('/hello', async (req, res, next) => {
  const auth = req.get('Authorization');
  if (!auth) res.send('no auth');
  if (!auth.indexOf('Bearer') === -1 ) res.send('no auth');
  const token = auth.split('Bearer ')[1];
  const user = JWT.verify(token, key);
  if(user.expireAt < Date.now().valueOf()) res.send('token 过期')
  res.send(user);
});
  
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

/*
https://github.com/auth0/node-jsonwebtoken


访问 http://localhost:3000/login?username=hjx
返回
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImhqeCIsImlhdCI6MTU4NjUwNzM5N30.E70gGqKDYREzEpLhlQVEv-vE1alFQ4gXya_ERzG3IOM

eyJ开头通常是 base64

node命令行里输入
// token第一部分
new Buffer('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9','base64').toString();
得到 '{"typ":"JWT","alg":"HS256"}'

// token第二部分
new Buffer('eyJ1c2VybmFtZSI6ImhqeCIsImlhdCI6MTU4NjUwNzM5N30','base64').toString();
得到 '{"username":"hjx","iat":1586507397}'

// token第三部分 E70gGqKDYREzEpLhlQVEv-vE1alFQ4gXya_ERzG3IOM
无法解码，它是基于 JWT.sign(user,'密钥') 生成的


// 测试 token
http://localhost:3000/hello
Headers里 添加 
key:Authorization 
value:Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImhqeCIsImlhdCI6MTU4NjUwNzM5N30.E70gGqKDYREzEpLhlQVEv-vE1alFQ4gXya_ERzG3IOM
*/