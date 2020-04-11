const ResidService = require('./redis_service');
const Spider = require('./spider_article');

switch(process.argv[2]){
  case 'generate_ids':
    ResidService.generateAcfunIdsToRedis(process.argv[3], process.argv[4])
      .then(r=>{
        console.log('done');
        process.exit(0);
      })
      .catch(e=>{
        console.log(e);
        process.exit(1);
      })
    break;
  case 'start_getting_articles':
    // node spider.js start_getting_articles 10
    Spider.spideringArticles(process.argv[3])
      .then(r=>{
        console.log('done2');
        process.exit(0);
      })
      .catch(e=>{
        console.log(e);
        process.exit(1);
      })
    break;
  case 'start_getting_article':
    // 404的url https://www.acfun.cn/a/ac14637575  
    // node spider.js start_getting_article 14637575
    // video 的url  ac14598577 也会返回 404
    // node spider.js start_getting_article 14598577

    // 正常的文章 ac14635178
    // node spider.js start_getting_article 14635178

    Spider.getStringArticle(process.argv[3])
        .then(r=>{
        console.log('done2');
        process.exit(0);
        })
        .catch(e=>{
        console.log(e);
        process.exit(1);
        })
    break;
  default:
       console.log('no match action!')
       process.exit(0);
}