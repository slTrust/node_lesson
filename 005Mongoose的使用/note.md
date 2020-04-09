#### mongoose

- https://mongoosejs.com/

#### mongoDB 

- 推荐docker 方式
    - https://www.runoob.com/docker/docker-install-mongodb.html

```
docker run -p 27017:27017 -v $PWD/db:/data/db -d mongo:3.6.15
docker ps -a 查看 mongo id编号
# 进入 容器内部
docker exec -it id编号 bash 
# 开启 mongodb
mongo
```

使用方式

```
# 使用我们的数据库
use what_i_love
# 创建索引
db.users.createIndex({name:1})
# 获取索引
db.users.getIndexes({name:1})
```

### Express中使用mongoose

- [代码仓库](https://github.com/slTrust/express-demo/tree/180f61b3f505ed61a7835ff0c5659df15462912e)