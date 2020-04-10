const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const app = express();

app.use(cookieParser());
app.use(cookieSession({
  name: 'what_i_love_session',
  keys: ['fdafadsfads'],
  maxAge: 86400
}));


app.get('/login', (req, res, next) => {
  const { username } = req.query;
  req.session.user = { username };
  res.send();
});
  
app.get('/hello', (req, res, next) => {
  const user = req.session.user?req.session.user:null;
  console.log(user);
  if (user) {
    res.send(`<h1>hello , ${user.username}</h1>`);
  } else {
    res.send('no login!')
  }
});
  
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});