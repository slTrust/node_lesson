## 推荐系统

- 参考注册 知乎 掘金后，让你选择喜欢关注的内容。然后每次登录都会给你推荐相关分类的内容

### 数据结构约定

单条内容数据结构
符合本平台推荐内容的数据，结构应该如下：

```
title: {type: String, required: true, }
contentType: { type: String, } // link, full-text, dom, video, audio
content: { type: Mixed, }, 
tags: [{
  name: String,
  value: String,
  score: Number, // 权重  用于这些标签以什么样的优先级的展示
}],
contentId: String, // 各大平台对应的id 
source: {type: String, required: true}, // 来源于那个爬虫
```

### 协议

本协议使用HTTP/1.1协议进行通讯，通过约定一系列的接口，实现爬虫微服务与聚合推荐系统的数据共通与同步 协议名称：FULL_NET_SPIDER_PROTOCOL/0.1

#### 概念

- 服务发现：为满足聚合推荐服务发现合规的爬虫，并进行数据拉取的操作，所需要的服务发现和注册 数据同步：本服务规定了一系列的数据同步规则，用于在聚合推荐服务和爬虫之间交换数据

### 聚合推荐服务接口约定

> 注册服务接口：

```
PATH: /api/service
METHOD: POST
CONTENT-TYPE: application/json
REQUEST-BODY:
{
  service: {
    name: String, // 服务名，不能与数据库中现有服务重名
    validationUrl, // 验证URL，爬虫服务需要在该URL被访问时采取正确的回应
  }
}

SUCCESS-RESPONSE-BODY:
{
  code:0,
}

ERROR-RESPONSE-BODY:

{
  code: errorCode,
  msg: errorMsg,
}
```

> 修改服务注册信息接口

```
PATH: /api/service/:serviceName
METHOD: PATCH
CONTENT-TYPE: application/json
REQUEST-BODY:
{
  service: { 
    name: String, // 服务名，不能与数据库中现有服务重名
    validationUrl, // 验证URL，爬虫服务需要在该URL被访问时采取正确的回应
  }
}

SUCCESS-RESPONSE-BODY:
{
  code:0,
}

ERROR-RESPONSE-BODY:
{
  code: errorCode,
  msg: errorMsg,
}
```

> 注销服务接口

```
PATH: /api/service/:serviceName
METHOD: DELETE
SUCCESS-RESPONSE-BODY:
{
  code:0,
}

ERROR-RESPONSE-BODY:
{
  code: errorCode,
  msg: errorMsg,
}
```

### 爬虫服务接口约定

- 验证接口：通过调用该接口，爬虫服务应该返回符合规范的内容，以标识爬虫能够兼容聚合系统的协议

```
PATH: 由注册服务接口规定
METHOD: GET
CONTENT-TYPE: application/json
SUCCESS-RESPONSE-BODY:
{
  code:0,
  protocol: {
    version: String,
    name: 'FULL_NET_SPIDER_PROTOCOL',
  },
  config:{
    singleContent:{
      url: String,
      frequencyLimit: Number, // 拉取频率
    },
    contentList:{
      url: String,
      pageSizeLimit: Number,
      frequencyLimit: Number, // 拉取频率
    },
  }
}

ERROR-RESPONSE-BODY:
{
  code: errorCode,
  msg: errorMsg,
}
```

> 获取多条内容接口

```
PATH: 由验证接口返回
METHOD: GET
CONTENT-TYPE: application/json
REQUEST-PARAMS:
{
  pageSize: Number, // 每一页数据的大小 多少条
  latestId: String, // 最近的id 作为分页的依据，因为 我们的ids是从4100000里随机取的
}

SUCCESS-RESPONSE-BODY:
{
  code:0,
  data:{
    contentList:[],
  },
}
```