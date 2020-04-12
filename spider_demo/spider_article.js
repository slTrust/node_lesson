const axios = require('axios');
const cherrio = require('cheerio');

const RedisService = require('./redis_service');
const { MongoClient } = require('mongodb')
let client;
let db;

async function spideringArticles(count){
  const ids = await RedisService.getRandomAcfunIds(count);
  let succeedCount = 0;
  let errorCount = 0 ;
  for(let id of ids){
    await getStringArticle(id)
      .then(r=>{
        succeedCount++;
      })
      .catch(e=>{
          errorCount++
          if(e.errorCode !== 4040000) throw e;
      })
    await new Promise((rsv)=>{
      setTimeout(rsv, 1000);
    })
  }
  return {
    succeedCount,
    errorCount
  }
}

async function getStringArticle(id){
  if(!client){
    client = await MongoClient.connect('mongodb://localhost:27017',{useNewUrlParser: true, useUnifiedTopology: true})
  }
  if(!db){
    db = client.db('acfun');
  }

  const url = `http://www.acfun.cn/a/ac${id}`;
  const res = await axios.get(url)
    .catch(e=>{
        if(e.response && e.response.status && e.response.status == 404){
            const err = new Error('Not found');
            err.errorCode = 4040000;
            throw err;
        }else{
            throw e;
        }
    })
  const html = res.data;
  const $ = cherrio.load(html);
  const articleContentFlg = $('.article-content');
  if(!articleContentFlg){
      return;
      // do nothing and return 
      // if 404 do nothing
      // if deleted from acfun, do nothind
      // if is video, put id back to pool
  }else{
      // add to already-got set
      await RedisService.markArticleIdSucceed(id);
  }

  const main = $('#main');
  const data = main.children('script').eq(0).html();
  const window = {}; 
  const articleContentHTML = eval(data).parts[0].content;
  $('.article-content').html(articleContentHTML);
  const articleContent = $('.article-content');
  const doms = articleContent.children();

  
  const content = getTextOrImg(doms,[]);

  // console.log(content)

  
  await db.collection('articles')
    .findOneAndUpdate({
      acfunid:id
    },
    {$set:{
      acfunid: id,
      content: content ,
      articleContentHtml: articleContentHTML,
      createAt: Date.now().valueOf()
    }},
    {
      upsert: true, 
      returnNewValue: true
    })
      .then(r=>{
         console.log("Updated");
      })
      .catch(e=>{
           throw e;
      })

  function getTextOrImg(doms,arr){
    doms.each(function(i,ele){
        if(ele.tagName === 'p'){
            // console.log($(ele).text())
            arr.push($(ele).text())
            let children = $(ele).children();
            children.each(function(i2,ele2){
                // console.log('--'+i,i2, ele2.tagName)
                if(ele2.tagName === 'img'){
                    // console.log($(ele2).attr('src'))
                    arr.push($(ele2).attr('src'))
                }else{
                    // console.log($(ele2).text())
                    arr.push($(ele2).text())
                }
            })
        }
      })
      return arr;
  }
  
  function getTextOrImg2(dom,arr){
    const d = $(dom);
    let children = d.children();
    // console.log(d[0].tagName)
    if(d.text()){
        arr.push(d.text())
    } 
    if(children.length === 0){
        if(d[0].tagName === 'img'){
            arr.push(d.attr('src'))
        }else{
            arr.push(d.text())
        }
    }else{
        for(let i=0;i<children.length;i++){
            const child = children[i];
            getTextOrImg(child,arr);
        }
    }
    return arr;
  }
}

module.exports = {
    spideringArticles,
    getStringArticle
}
