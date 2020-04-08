module.exports = function auth (req, res, next) {
    console.log('开始鉴权');
    if(req.query.username === 'hjx'){
        next();
    }else{
        res.end('please to login')
    }
}