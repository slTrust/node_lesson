### 一台机器从头部署我们的项目

> 001 登录阿里云服务器,我的是 centos 安装 docker

- [菜鸟教程](https://www.runoob.com/docker/centos-docker-install.html) 按照它的步骤基本 只要有docker 就行了
- [设置docker开机启动](https://www.cnblogs.com/rwxwsblog/p/5436445.html)

```
# Docker 安装后 报 Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running? 解决办法
$ systemctl daemon-reload
$ sudo service docker restart
```


> 002 docker 安装 mongo

```
# 服务器找个目录新建文件夹 用于持久化数据
mkdir mongo_data
cd mongo_data

# 安装指定版本的 mongo
docker pull mongo:3.6.15
docker run --restart=always -itd -p 27017:27017 -v $PWD/db:/data/db mongo:3.6.15

# 进入内部
docker exec -it id号 bash

# 启动 mongoDB
mongo

# 查询所有数据库
show dbs
# 使用数据库
use xxx

# 查询表
show collections
```

> 003 docker 安装 redis

```
# 服务器找个目录新建文件夹 用于持久化数据
mkdir redis_data
cd redis_data


docker pull redis:4.0.6

docker run --restart=always -itd -p 6379:6379 -v $PWD/db:/data redis:4.0.6

# 进入内部
docker exec -it id号 bash
redis-cli
```

> 004安装 nvm 管理node
    - [centos7 安装NVM 管理node](https://www.cnblogs.com/qq4535292/p/9848040.html)
    - [CentOS下安装nvm](https://www.cnblogs.com/ycyzharry/p/10186251.html)
    - 安装 node 12 `nvm install v12.14.1`
> 005 全局安装 nrm 用于 提升下载速度 `npm install -g nrm`  然后 `nrm use taobao`

> 006 全局安装 pm2 `npm i -g pm2@2.9.1`

> 007 先把爬虫服务跑起来

```
cd ~/

git clone https://github.com/slTrust/acfun_spider.git

cd acfun_spider

# 安装依赖
npm i
```

- 解决 安装nodejieba 报错问题
    - `npm i -g node-pre-gyp`
    - `npm i -g node-gyp`
    - [node依赖的gcc版本过低](https://blog.csdn.net/u010757785/article/details/77446849)
- 注意 setting.js 是设置 mongodb / redis / 日志内容等配置的，默认是上面的端口
- 按照 https://github.com/slTrust/acfun_spider.git 的readme操作
- 都成功后  服务器安全组开启 3000端口
- http://你的ip:3000/spiderProtocol 获取服务协议
- http://你的ip:3000/content?pageSize=20 获取爬虫内容

> 008 准备es

- [安装 jdk8](https://blog.csdn.net/pang_ping/article/details/80570011)
- [下载对应版本es](https://www.elastic.co/guide/en/elasticsearch/reference/5.5/zip-targz.html)
- 开启 es可能会报错 内存不够
- 参考 https://blog.51cto.com/zhuyuanpo/1908365 修改内存
- [阿里云1G内存开启 es](https://learnku.com/laravel/t/22414)
- es不让root用户启动解决办法
    - https://www.cnblogs.com/gcgc/p/10297563.html
    - https://blog.csdn.net/ooyhao/article/details/84704151
    - 添加新用户 找不到 main问题
        - https://segmentfault.com/a/1190000019413175?utm_source=coffeephp.com

```

运行 bin/elasticsearch 默认开启在 9200 端口
```

> 009 把我的 what_i_love 项目克隆下来

```
cd ~/

git clone https://github.com/slTrust/express-demo.git
cd express-demo

npm i
```

- 按照 api_doc.md 
    - 注意 不要运行在 3000 端口，我们的 acfun_spider 拉取数据接口是写死的 3000，不然你无法注册 爬虫服务器 ，拉不到数据
    - 注册一个用户
    - 注册爬虫服务，然后开始从 “注册的爬虫服务”拉取数据  `node scripts/fetch_spider_data.js`
    - 添加一个订阅子标签  从 content 里找一个id即可
