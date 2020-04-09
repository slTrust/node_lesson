### MongoDB

MongoDB作为最流行的NoSQL数据库之一，运用灰常广泛，其友好的JSON支持和灵活的表单结构，使其在使用Node.js开发的诸多Web应用中非常受欢迎
在高性能分布式存储领域，MongoDB也有一席之地，然而MongoDB对事务的不友好和过于灵活的特性也带来了一些问题

#### mongoose

mongoose是MongoDB的Node.js框架，在处理MongoDB表管理、验证方面有方便之处

**hello world**

```
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const uri = `mongodb://localhost:27017/what_i_love`;
mongoose.connect(uri, { useMongoClient: true });
const db = mongoose.connection;

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true, index: 1 },
  age: { type: Number, max: 188, min: 0 },
});

const UserModel = mongoose.model('user', UserSchema);

(async (params) => {

  const filter = {};
  if (params.name) filter.name = params.name;

  const flow = UserModel.find(filter);

  if(params.projection) flow.select(params.projection);

  if(params.sort) flow.sort(params.sort);

  const users = await flow.exec();

  return users;

})({
  name:"xiaoli",
  projection: {age:1},
  // sort:{age:-1},
  sort:'-age'
})
  .then(r => {
    console.log(r);
  })
  .catch(e => {
    console.log(e);
  });

db.on('open', () => {
  console.log('db connected!');
});

db.on('error', (e) => {
  console.log(e);
});
```

#### Schema属性和验证

```
{
    name:{
        type: String,
        required: true
    }, //存储之前会验证
    age:{
        type:Number,
        min:1,
        max:[12, 'Growned are not welcome!'],
    },
    address:[new Schema({
      city:String,
      province:String,
    })]
}
```

#### 查询（流）

```
const query = Model.find({name:{$regex:"a"}});
query.where('age').lte(2);
if(params.limit) query.limit(params.limit);
query.sort('-age');

const result = await query.then();
```

使用Schema.statics和Schema.method可以定义用于查询的方法