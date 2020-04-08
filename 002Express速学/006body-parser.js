const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

function bodyParse原理(options){
    return function(req,res,next){
        if(options.abc){
            console.log('hi')
        }
        //打印解析后的请求体
        console.log(req.body);
        next();
    }
}
app.use('/',bodyParse原理({abc:true}));

app.use('/',function(req,res){
    res.json(req.body);
});

app.use((err,req,res,next)=>{
    res.end(err);
})

app.listen(3000,()=>{
    console.log('port 3000 is listening!')
});