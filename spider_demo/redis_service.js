/*
爬虫逻辑 

比如 acfun 文章有400万
https://www.acfun.cn/a/ac41337574

ac41337574 代表他的 文章 id号

我们不能顺序的爬取， 而是 从 400万 的数字里 随机取一个 进行爬取
*/
const Redis = require('ioredis');
const redis = new Redis();

const ACFUN_ID_SET_REDIS_KEY = 'acfun_id_set';
// 已经爬取到的文章
const ACFUN_ARTICLE_GOT_ID_SET = 'acfun_article_got_id_set';

async function generateAcfunIdsToRedis(min,max){
  for(let i = min; i < max ; i++){
    var arr = new Array(10000)
    for(let j = 0; j < 10000 ; j++){
      arr[i * 10000 + j] = i * 10000 + j;
    }
    await redis.sadd(ACFUN_ID_SET_REDIS_KEY, ...arr);
  }
  /*
  // 这样是非常慢的 每次循环就有一次 写入 redis
  for(let i = min; i < max ; i++){
    await redis.sadd(ACFUN_ID_SET_REDIS_KEY, i);
  }
  */
}

async function getRandomAcfunIds(count){
  const ids = await redis.spop(ACFUN_ID_SET_REDIS_KEY, count);
  return ids
}

async function markArticleIdSucceed(id){
  await redis.sadd(ACFUN_ARTICLE_GOT_ID_SET, id);
}

async function idBackInPool(id){
  await redis.sadd(ACFUN_ID_SET_REDIS_KEY, id);
}

// 获取剩余 id个数
async function getRemainingIDCount(){
  return await redis.scard(ACFUN_ID_SET_REDIS_KEY)
    .then(r=>Number(r));

}

module.exports = {
    generateAcfunIdsToRedis,
    getRandomAcfunIds,
    markArticleIdSucceed,
    idBackInPool,
    getRemainingIDCount
}
