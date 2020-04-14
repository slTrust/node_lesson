### 由于之前的 spider_demo 字段名命名不太好

- 请运行如下更新字段名语句，修改字段，后期爬虫服务将 使用 ac_article_spider 项目

```
db.articles.update({}, {$rename : {"acfunid" : "acfunId"}}, false, true)
db.articles.update({}, {$rename : {"createAt" : "createdAt"}}, false, true)
db.articles.update({}, {$rename : {"orginCreateAt" : "originCreatedAt"}}, false, true)
```