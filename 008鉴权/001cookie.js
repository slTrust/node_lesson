const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());
app.get('/login', (req, res, next) => {
  // 设置 cookie头
  res.set('Set-Cookie', `username=${req.query.username}`);
  res.send();
});
  
app.get('/hello', (req, res, next) => {
  if (req.cookies.username) {
    res.send(`<h1>hello , ${req.cookies.username}</h1>`);
  }
});
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});