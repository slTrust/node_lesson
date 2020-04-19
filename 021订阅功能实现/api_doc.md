## acfun_spider

### 1.1 获取爬虫协议接口

- 接口地址

```
get   /spiderProtocol
```

- 参数

```
无
```

- 响应

```
{
    code: 0,
    protocol: {
      name: 'FULL_NET_SPIDER_PROTOCOL',
      version: '0.1',
    },
    config: {
      contentList: {
        url: 'http://localhost:3000/content',
        pageSizeLimit: 20,
        frequencyLimit: 5,
      },
    },
}
```

### 1.2 获取爬虫内容接口

- 接口地址

```
get   /content
```

- 参数

参数名|	类型|长度|必填|说明
-|-|-|-|-
pageSize | int | - |否|一页多少条|
latestId | string | - |否|最后一条记录的contentId ，用于持续爬取|
- 响应

```
{
	"contentList": [{
		"title": "【漫画】魔法少女☆伊莉雅3rei 71话 [魔伊吧汉化组]",
		"contentType": "dom",
		"content": {
			"html": "<p>...</p>",
			"text": "连载版..."
		},
		"tags": [{
			"name": "ARTICLE_TAG_TITLE",
			"value": "莉雅",
			"score": 1
		}],
		"contentId": "5e92c42fb73104be063d9b90"
	}]
}
```

## what_i_love

### 公共参数

```
token：用户登录状态验证密钥  添加在 header里
Authorization:Bearea token
userId: 用户ID
```
### 1.1 登录接口

- 接口地址

```
post   api/login
```

- 参数

参数名|	类型|长度|必填|说明
-|-|-|-|-
username | string | - |否|账号|
password | string | - |否|密码|


- 响应

```
{
    "code": 0,
    "data": {
        // token 需要权限验证的接口
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTlhYmJiNGFmMmI4YmVkNWYzODQ2YmUiLCJleHBpcmVBdCI6MTU4NzM1MTI2NjMzNSwiaWF0IjoxNTg3MjY0ODY2fQ.DjmR-k08_cgPmPPPe95jO-6pHbhTiJelGipGkuoLjTI",
        "user": {
            "_id": "5e9abbb4af2b8bed5f3846be",
            "username": "hjx",
            "name": "老黄",
            "__v": 0
        }
    }
}
```

### 1.2 用户注册接口

- 接口地址

```
post /api/user
```

- 参数

参数名|	类型|长度|必填|说明
-|-|-|-|-
username | string | - |是|账号|
password | string | - |是|密码|
name | string | - |是|昵称|

- 响应

```
{
    "code": 0,
    "data": {
        "user": {
            "_id": "5e9bbf1984ec513b6920c023",
            "username": "hjx2",
            "name": "老黄2"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTliYmYxOTg0ZWM1MTNiNjkyMGMwMjMiLCJleHBpcmVBdCI6MTU4NzM1MTcwNTQzOSwiaWF0IjoxNTg3MjY1MzA1fQ.Zy1KqIzyHcb506Xh0RyehAyGhW1SZRU3cqMRs1pnfOo"
    }
}
```

### 1.3 获取用户列表

- 接口地址

```
get /api/user
```

- 参数

无

- 响应

```
{
    "code": 0,
    "data": {
        "users": [
            {
                "_id": "5e9abbb4af2b8bed5f3846be",
                "username": "hjx",
                "name": "老黄",
                "__v": 0
            },
            {
                "_id": "5e9bbf1984ec513b6920c023",
                "username": "hjx2",
                "name": "老黄2",
                "__v": 0
            }
        ]
    }
}
```

### 1.4 查询单个用户信息

- 接口地址

```
get  /api/user/:userId
```

- 参数

参数名|	类型|长度|必填|说明
-|-|-|-|-
userId | string | - |是|userId|

- 响应

```
{
    "code": 0,
    "data": {
        "user": {
            "_id": "5e9abbb4af2b8bed5f3846be",
            "username": "hjx",
            "name": "老黄",
            "__v": 0
        }
    }
}
```

### 2.1 注册爬虫服务

- 接口地址

```
post  /api/spider
```

- 参数

```
// body里传递 json格式的数据如下
{
  "service":{
    "name":"hjx的服务2",  // 爬虫服务名称
    "validationUrl":"http://localhost:3000/spiderProtocol" // 爬虫接口协议 参考 acfun_spider项目的 1.1接口
  }
}
```

- 响应

```
{
    "code": 0,
    "data": {
        "spider": {
            "__v": 0,
            "name": "hjx的服务3",
            "validationUrl": "http://localhost:3000/spiderProtocol",
            "status": "validated",
            "_id": "5e9bc4246e6ad04138bd9f01",
            "contentList": {
                "url": "http://localhost:3000/content",
                "frequencyLimit": 5,
                "pageSizeLimit": 20
            }
        }
    }
}
```

添加爬虫服务之后 可以通过脚本 定时拉取 注册的爬虫数据

```
node scripts/fetch_spider_data.js
```

### 2.2 用户添加订阅子标签功能

- 接口地址

```
post  /api/user/:userId/subscription
需要携带token
```

- 参数

参数名|	类型|长度|必填|说明
-|-|-|-|-
userId | string | - |是|userId|
subscriptionType | string | - |是|['spider_service','tag']|
sourceId | string | - |是|对应的 content 的spiderServiceContentId 来源于 acfun_spider项目的 artile 的 _id|

- 响应

```
{
    "code": 0,
    "data": {
        "sub": {
            "_id": "5e9ac3d8036292968bca2882",
            "sourceId": "5e96824250b3e1599db7212e",
            "type": "spider_service",
            "userId": "5e9abbb4af2b8bed5f3846be",
            "__v": 0
        }
    }
}
```

### 2.3 获取订阅内容数据

- 接口地址

```
post  /api/user/:userId/subContent
需要携带token
```

- 参数

参数名|	类型|长度|必填|说明
-|-|-|-|-
userId | string | - |是|userId|

- 响应

```
{
    "code": 0,
    "data": {
        "contents": [
            {
                "_id": "5e9b37c8758704e6892798e0",
                "spiderServiceContentId": "5e933113b73104be063d9c55",
                "__v": 0,
                "contentType": "dom",
                "spiderServiceId": "5e96824250b3e1599db7212e",
                "title": "【漫画】即使如此我们也没做 #07·后篇",
                "tags": [
                    {
                        "score": 1,
                        "value": "07",
                        "name": "ARTICLE_TAG_TITLE",
                        "_id": "5e9b37c843feeb31d83f24cf"
                    }
                ],
                "createAt": 1587267330145,
                "content": {
                    "html": ""
                }
            }
        ]
    }
}
```






