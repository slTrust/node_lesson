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