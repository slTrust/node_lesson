const http = require('http')
const server = http.createServer()
server.listen(8888)

server.on('request',(req,res)=>{
    req.statusCode = 200;
    res.end('welcome to node')
});

/*
http://localhost:8888/
*/