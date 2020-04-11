const Redis = require('ioredis');

const redis = new Redis();

(async ()=>{
  const abc = await redis.get('abc');
  const smembers = await redis.smembers('my_set_1');
  const hset = await redis.hgetall('my_hash_1');

  console.log(abc);
  console.log(smembers)
  console.log(hset)
})()
  .then(r=>{

  })
  .catch(e=>{

  })