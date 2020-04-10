const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const app = express();

app.use(cookieParser());
app.use(expressSession({
  secret: 'keyboard cat',
  resave: false, 
  saveUninitialized: true,
  cookie: { 
    secure: false , // 如果 true 代表非 https时候是不传递的cookie的
    maxAge: 10000 // 10秒过期
  }
}));


app.get('/login', (req, res, next) => {
    console.log(req.session)
  const { username } = req.query;
  req.session.user = { username };
  req.session.save();
  res.send(req.session);
});
  
app.get('/hello', (req, res, next) => {
  res.send(req.session.user.username);
});
  
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});