## 使用内嵌文档实现数组元素分值的算分

### acfun_spider 增加一个算分实现 

- 代码参考[https://github.com/slTrust/acfun_spider](https://github.com/slTrust/acfun_spider)
- `scripts/tag_score_adjustment.js`

#### 备注：如果你用的不是最新版代码

- 引入 jieba分词后 没有对 title 进行添加到 tags
- 历史版本爬取数据代码字段错了

### what_i_love 进行es标签归一化

> 条件1：保证 爬虫服务正常运行

- acfun_spider 项目搞定后 只要 本地运行 `node bin/www` 即可 注意代码里写死的 3000端口，本项目从注册服务那获取数据也是 3000端口 就别动了

> 条件2 ：保证es服务正常运行

- 开启es服务  项目默认9200端口

> 条件3：清数据测试 what_i_love 从服务拉取数据是否正常

- 保证 mongodb 运行着
- mongodb 里 
    - use what_i_love
    - db.contents.remove({}) 

> 终于可以开搞了

- 拉取 [what_i_love项目](https://github.com/slTrust/express-demo/tree/1fd3feedda8bdf0b5fbeb8ba13e184b6c1cab7ae) 
- 安装好依赖
- 直接运行 `PORT=3333 node bi n/www`
- 访问 http://localhost:9200/what_i_love/_search 验证es数据已经存入



