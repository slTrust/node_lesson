const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

const users = [];

app.get('/login', (req, res, next) => {
  const { username } = req.query;
  if(!users.find(u=> u.username === username)){
    res.set('Set-Cookie', `username=${username}`);
    users.push({username})
  }
  res.send();
});
  
app.get('/hello', (req, res, next) => {
  const { username } = req.cookies;
  if (username) {
    res.send(`<h1>hello , ${username}</h1>`);
  } else {
    res.send('no login! ')
  }
});
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});