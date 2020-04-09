const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

const url = 'mongodb://localhost:27017/what_i_love';
const connection = mongoose.connect(url,{useMongoClient:true});
const db = mongoose.connection;

const UserSchema = new Schema({
  // index 代表 默认的排序
  name: {type: String, required: true, unique: true, index: 1},
  age: {type: Number, max: 188, min: 0}
})

const UserModel = mongoose.model('user',UserSchema);

(async ()=>{
  const user = await UserModel.create({
    name:'laoyang',
    age:20
  })
  /*
  // 更新 这个不会 把 name盖掉 而是 只更新 age
  const user2 = await UserModel.update({name:'laoyang'},{age:1})

  // 更新后并返回
  const user3 = await UserModel.findOneAndUpdate({name:'laoyang'},{age:12},{new:true})

  // 删除
  const user4 = await UserModel.remove({name:'laoyang'}) 
  */
  return user;
})()
.then(r=>{
  console.log(r)
})
.catch(e=>{
  console.log(e)
});

db.on('open',()=>{
  console.log('db connected!')
})
db.on('error',(e)=>{
  console.log(e)
})

