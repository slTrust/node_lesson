### 解决 连接问题

提示你：(node:80655) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.

- 添加参数`{useNewUrlParser: true, useUnifiedTopology: true}`
- [参考链接](https://stackoverflow.com/questions/57895175/server-discovery-and-monitoring-engine-is-deprecated)

```
var MongoClient = require('mongodb').MongoClient;
(async ()=>{
    var db = await MongoClient.connect('mongodb://localhost:27017/acfun');
    db.collection('customers').findOne({}, function (findErr, result) {
        if (findErr) throw findErr;
        console.log(result);
        client.close();
    });
  })()
  .then(r=>{
    console.log(r)
  })
  .catch(e=>{
    console.log(e)
  });

```
### 解决db.collection is not function

- 不能直接连到数据库 而是先连接到 mongodb
- 通过 `var client = await MongoClient.connect('mongodb://localhost:27017',{useNewUrlParser: true, useUnifiedTopology: true});`
- 然后在连接数据库`var db = client.db('mytestingdb');`
- [参考链接](https://stackoverflow.com/questions/47662220/db-collection-is-not-a-function-when-using-mongoclient-v3-0)

> 不能直接这样

```
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/mytestingdb";

(async ()=>{
    var client = await MongoClient.connect('mongodb://localhost:27017',{useNewUrlParser: true, useUnifiedTopology: true});
    var db = client.db('acfun');
    db.collection('customers').findOne({}, function (findErr, result) {
        if (findErr) throw findErr;
        console.log(result);
        client.close();
    });
    
  })()
  .then(r=>{
    console.log(r)
  })
  .catch(e=>{
    console.log(e)
  });
```

### How to use findOneAndUpdate in MongoDB in Node

- https://stackoverflow.com/questions/38078132/how-to-use-findoneandupdate-in-mongodb-in-node

```
MongoClient.connect(url, function(err,db){
   if (err) { throw err; }
   else {
     var collection = db.collection("connections");
     collection.findOneAndUpdate({_id: "12"}, {$set: {protocol: "http"}}, {upsert: true}, function(err,doc) {
       if (err) { throw err; }
       else { console.log("Updated"); }
     });  
   }
 });
```