# redis

- [文档](https://redis.io/)

### 推荐docker安装 redis

- https://www.runoob.com/docker/docker-install-redis.html

```
docker pull redis:4.0.6

docker run -itd --name redis-test -p 6379:6379 redis:4.0.6

# 进入 redis内部
docker exec -it id号 bash

# 连接 redis
redis-cli
```

> 基本操作

```
# 设置 abc=123
set abc 123

# 获取 abc， 得到 123
get abc 

# 删除 abc 这个 key
del abc

# 删库
flushall
```

#### 设置值过期时间

- 订单，操作时间

```
# 设置值
set abc 123

# 3秒后过期
expire abc 3

# 3秒后 获取 abc nil
get abc 
```

### set类型的值

- sadd 
- smembers 获取 set值

```
# set里丢个 1
sadd my_set_1 1

# set里丢个 2
sadd my_set_1 2

# set里丢个 3
sadd my_set_1 3

# 获取set
smembers my_set_1

# 一次性插入多个值
sadd my_set_1 2 2 4 5
```

#### incrby 原子操作

```
set count 10

# count - 1
incrby count -1

# count +1
incrby count 1
```

#### sismember 查询集合里的值存在不存在

```
# 查询 set里  1 存在不存在  存在1 不存在0
sismember my_set_1 1
```

#### scard 统计 set中元素个数

```
scard my_set_1
```

#### srem 移除 set里的元素

```
srem my_set_1 1
```

#### spop 从 set里随机移除一个

```
spop my_set_1
```

#### srandmember 随机获取一个 set个数不变

```
srandmember my_set_1
```

### zadd 

- 支持排序的set 设置时候 有两个值 "score 和 member"
- 时间复杂度是 O(log(N))

```
# 往set 里 a 它的 score 是 100
zadd my_sort_set_1 100 a
zadd my_sort_set_1 10 b

# 获取 set里的内容  0 0 代表 min ~ max,此时查不出来 
zrangebyscore my_sort_set_1 0 0 

# 获取 set里的内容 score在 0～100
zrangebyscore my_sort_set_1 0 100
得到
1) "b"
2) "a"

# 如果你想 反序
zrevrangebyscore my_sort_set_1 100 0
得到
1) "a"
2) "b"


# 排序后同时获取 score的值
zrevrangebyscore my_sort_set_1 100 0 withscores
1) "a"
2) "100"
3) "b"
4) "10
```

- 微博内容的时间轴

### hset

- 类似js里的 map
- 不能针对 hset里某一个值 设置过期时间
- 设置过期时间是针对这个 set整体

```
# 设置值
hset my_hash_1 abc 123
hset my_hash_1 def 456

# 获取
hgetall my_hash_1
```

### ttl

- 查询剩余存活时间

```
set a 100
expire a 10

# 代表 a还能活几秒
ttl a 
```

#### redis 的优点

- 保证在很大的集群中非常快的处理请求，而且保证请求是原子性的
    - 原子性操作  `+1 -1`
    - 秒杀
- 跨进程数据同步问题 
    - IPC(inter-process communication)

## 爬虫服务

- redis_server.js 
- spider_article.js 爬取文章逻辑
- spider.js 定义脚本
    - `node spider.js generate_ids 0 41` 生成 0 ～ 410000的 id
    - `node spider.js start_getting_articles 10` 从 生成的id里 随机提取 10个出来 爬取
    - `node spider.js start_getting_article 14637575` 测试爬取单个文章内容 如 https://www.acfun.cn/a/ac14637575

