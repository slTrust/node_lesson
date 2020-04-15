### 001准备工作

- [clone acfun_spider项目](https://github.com/slTrust/acfun_spider/tree/c5de68d3330274694907c3b21959d3745a67213d)
    - 注意是我这次提交的版本
- 自行配置好 redis/mongodb 推荐使用 docker
- 按照 readme.md 文档 爬一些基础数据 
- 然后根目录运行 `node bin/www` 
- 默认运行为 3000 端口你最好别改，根后面的步骤有关联

### 002 准备工作2

- [clone node_demo项目](https://github.com/slTrust/express-demo/tree/56453493c17ab9b50963a6c702fbbfb22c8a1f27)
    - 注意是我这次提交的版本
- 自行配置好 redis/mongodb 推荐 docker
- 项目根目录运行 `PORT=3333 node bin/www`
- post 访问 聚合服务注册接口 `http://localhost:3333/api/admin/spider`
body里传递 json格式的内容 形如
```
{
  "service":{
    "name":"hjx的服务",
    "validationUrl":"http://localhost:3000/spiderProtocol"
  }
}

// 这里的 validationUrl 就是
acfun_spider项目里的 协议接口 返回的值内容是 写死的,因为目前就爬了一个 acfun.com 的内容 
router.get('/spiderProtocol', (req, res) => {
  res.json({
    code: 0,
    protocol: {
      name: 'FULL_NET_SPIDER_PROTOCOL',
      version: '0.1',
    },
    config: {
      contentList: {
        url: 'https://localhost:3000/content',
        pageSizeLimit: 20,
        frequencyLimit: 5,
      },
    },
  });
});

// url acfun_spider项目里的爬虫内容获取接口
```

如果请求成功会返回

```
{
    "code": 0,
    "data": {
        "spider": {
            "__v": 0,
            "name": "hjx的服务",
            "validationUrl": "http://localhost:3000/spiderProtocol",
            "status": "validated",
            "_id": "5e967f93a111945493bbccf7",
            "contentList": {
                "url": "https://localhost:3000/content",
                "frequencyLimit": 5,
                "pageSizeLimit": 20
            }
        }
    }
}
```

**注册成功后可查询 mongo 里的数据**

```
use what_i_love

show collections

db.spiderservices.find({})

返回如下内容
{ "_id" : ObjectId("5e967f93a111945493bbccf7"), "name" : "hjx的服务", "validationUrl" : "http://localhost:3000/spiderProtocol", "status" : "validated", "contentList" : { "url" : "https://localhost:3000/content", "frequencyLimit" : 5, "pageSizeLimit" : 20 }, "__v" : 0 }
```

### node_demo项目 触发 自动获取 爬虫服务接口的数据

- 注册服务后(前面的步骤正确完成后～)
- 停止项目 **node_demo项目**
- 再次运行`PORT=3333 node bin/www`
    - 这个触发方式比较傻，而且没有去重复和各种校验
    - 每次重启只要数据库里有 注册的服务，就会去从 爬虫接口拉数据
    - 建议每次清除数据`db.contents.remove({})`


### 我们的后续目标是使用 es 