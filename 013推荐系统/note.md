### 推荐系统

- [book:推荐系统实践](https://book.douban.com/subject/10769749/)
- 一个AI推荐的公司
    - [第四范式](http://www.4paradigm.com/)
- [网易云音乐的歌单推荐算法是怎样的？](https://www.zhihu.com/question/26743347/answer/34235147)

> 一些维度

- 你播放一首歌
    - 点击了收藏
    - 播放了几秒
    - 点击了删除
    - 这首歌的作者
- 你看一个网页
    - 如果你在地铁 嫌网速慢喜欢看 文字的
    - 如果你回到家 有了wify 就看一些 图片类/ 视频等
    - 这篇文章你停留了多久，有没有滑到底
    - 点赞/收藏/不感兴趣

### 部署项目

- 001 在 阿里云 买一台服务器 我买的是 2核4G, centos 7.5 
- 002 登录你的服务器
- 003 安装docker
    - [菜鸟教程](https://www.runoob.com/docker/centos-docker-install.html)
- 004 docker 安装mongodb
    - 新建目录 ～/mongo_data
    - 进入目录 cd mongo_data
    ```
    docker pull mongo:3.6.15
    docker run -p 27017:27017 -v $PWD/db:/data/db -d mongo:3.6.15
    docker ps -a 查看 mongo id编号
    # 进入 容器内部
    docker exec -it id编号 bash 
    # 开启 mongodb
    mongo
    ```
- 005 docker 安装 redis
    ```
    docker pull redis:4.0.6

    docker run -itd --name redis-test -p 6379:6379 redis:4.0.6

    # 进入 redis内部
    docker exec -it id号 bash

    # 连接 redis
    redis-cli
    ```

- 006 copy 目录 spider_demo 里的文件 到 `/root/node_demo`
    - redis_service.js  
    - spider_article.js
    - spider.js
    - package.json
- 007 安装 nvm 管理node
    - [centos7 安装NVM 管理node](https://www.cnblogs.com/qq4535292/p/9848040.html)
    - [CentOS下安装nvm](https://www.cnblogs.com/ycyzharry/p/10186251.html)
    - 安装 node 12 `nvm install v12.14.1`
- 008 全局安装 pm2 `npm i -g pm2@2.9.1`
- 009 在 `/root/node_demo` 里运行 `npm i ` 安装依赖
- 010 在 `/root/node_demo` 里运行 `node spider.js generate_ids 0 410` 生成 ids (0~4100000)的 acfun网站id
- 011 在 `/root/node_demo` 里运行 `NODE_ARGV_2=start_getting_articles pm2 start spider.js -i 0`
    - `-i 0 `代表根据你机器的核心数开启进程
- 012 查看日志`pm2 logs 0`

