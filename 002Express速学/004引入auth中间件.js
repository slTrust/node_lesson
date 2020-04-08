const express = require('express');
const app = express();

app.use('/', require('./004auth'));

app.use('/', function (req, res) {
    res.send('Hello World!');
});
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});