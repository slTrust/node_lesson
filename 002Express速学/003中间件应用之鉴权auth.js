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

app.use('/', auth);

app.use('/', function (req, res) {
    res.send('Hello World!');
});
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});