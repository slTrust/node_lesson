const express = require('express');
const app = express();

app.use('/', function (req, res, next) {
    console.log('中间件1')
    next();
});

app.use('/', function (req, res, next) {
    console.log('中间件2')
    next();
});

app.use('/', function (req, res) {
    res.send('Hello World!');
});
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});