> 理解pm2之前

```
之前的 what_i_love 项目 启动的时候运行的是 
node bin/www
```
- 但是这是开启一个进程，当遇到 exception 进程退出的时候。就没法管理 或者通知你 如何重启

### pm2

**nodejs进程管理器**

- 当我们的进程被杀掉后，能帮我们记录相应的日志，在重启，同时支持用 pm2的方式 开启多个进程

#### pm2使用

```
# 全局安装
npm i -g pm2@2.9.1

# 0代表 根据你电脑的核心数 启动 核心数的进程  
pm2 start bin/www -i 0

你就会看到
[PM2] Done.
┌──────────┬────┬─────────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────┬──────────┐
│ App name │ id │ mode    │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user │ watching │
├──────────┼────┼─────────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────┼──────────┤
│ www      │ 0  │ cluster │ 84072 │ online │ 0       │ 0s     │ 39% │ 43.5 MB   │ hjx  │ disabled │
│ www      │ 1  │ cluster │ 84073 │ online │ 0       │ 0s     │ 21% │ 39.5 MB   │ hjx  │ disabled │
│ www      │ 2  │ cluster │ 84078 │ online │ 0       │ 0s     │ 19% │ 35.7 MB   │ hjx  │ disabled │
│ www      │ 3  │ cluster │ 84086 │ online │ 0       │ 0s     │ 18% │ 34.0 MB   │ hjx  │ disabled │
│ www      │ 4  │ cluster │ 84111 │ online │ 0       │ 0s     │ 21% │ 31.7 MB   │ hjx  │ disabled │
│ www      │ 5  │ cluster │ 84125 │ online │ 0       │ 0s     │ 21% │ 31.4 MB   │ hjx  │ disabled │
│ www      │ 6  │ cluster │ 84138 │ online │ 0       │ 0s     │ 24% │ 33.3 MB   │ hjx  │ disabled │
│ www      │ 7  │ cluster │ 84151 │ online │ 0       │ 0s     │ 21% │ 32.2 MB   │ hjx  │ disabled │
└──────────┴────┴─────────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────┴──────────┘
```

> pm2 show 0

你会看到id编号0 进程对应的信息

```
 Describing process with id 0 - name www 
┌───────────────────┬──────────────────────────────────────────────────┐
│ status            │ online                                           │
│ name              │ www                                              │
│ restarts          │ 0                                                │
│ uptime            │ 73s                                              │
│ script path       │ /Users/hjx/Desktop/node_demo/what_i_love/bin/www │
│ script args       │ N/A                                              │
│ error log path    │ /Users/hjx/.pm2/logs/www-error-0.log             │
│ out log path      │ /Users/hjx/.pm2/logs/www-out-0.log               │
│ pid path          │ /Users/hjx/.pm2/pids/www-0.pid                   │
│ interpreter       │ node                                             │
│ interpreter args  │ N/A                                              │
│ script id         │ 0                                                │
│ exec cwd          │ /Users/hjx/Desktop/node_demo/what_i_love         │
│ exec mode         │ cluster_mode                                     │
│ node.js version   │ 12.14.1                                          │
│ watch & reload    │ ✘                                                │
│ unstable restarts │ 0                                                │
│ created at        │ 2020-04-12T04:54:16.668Z                         │
└───────────────────┴──────────────────────────────────────────────────┘
 Revision control metadata 
┌──────────────────┬─────────────────────────────────────────────┐
│ revision control │ git                                         │
│ remote url       │ https://github.com/slTrust/express-demo.git │
│ repository root  │ /Users/hjx/Desktop/node_demo/what_i_love    │
│ last update      │ 2020-04-12T04:55:17.235Z                    │
│ revision         │ 53459b1b620a0ba2586421060b7eb51fd2e0755f    │
│ comment          │ 引入鉴权                                        │
│ branch           │ master                                      │
└──────────────────┴─────────────────────────────────────────────┘
 Code metrics value 
┌─────────────────┬────────┐
│ Loop delay      │ 2.89ms │
│ Active requests │ 0      │
│ Active handles  │ 3      │
└─────────────────┴────────┘
 Add your own code metrics: http://bit.ly/code-metrics
 Use `pm2 logs www [--lines 1000]` to display logs
```

> pm2 monit

检测内存使用情况

> 查看 node相关的进程

```
ps aux | grep node

ps -ef | grep node

# 杀掉某个进程， pm2 会帮你自动重启
kill 进程编号

# 通过 pm2 查看那个是被重启的
    # low的方式 看一个
    pm2 show 1 | grep restarts
#  高级的
for i in $(seq 0 7); echo $(pm2 show $i | grep restarts)
```

> 停止所有 进程

```
pm2 stop all
```

> 清空

```
pm2 delete all
```

> 查看对应进程编号的 日志

```
pm2 log 0
```

### pm2启动我们的爬虫程序

```
NODE_ARGV_2=start_getting_articles pm2 start spider.js
```

修改 spider.js

```
switch(process.argv[2] || process.env.NODE_ARGV_2){
    ...
}
```

### 代码仓库

- [spider_demo](https://github.com/slTrust/node_lesson/tree/14871c58354cc455b98b63ef8e52b84fd13ea68b)


### 推荐系统参考

- [推荐系统实践](https://book.douban.com/subject/10769749/)