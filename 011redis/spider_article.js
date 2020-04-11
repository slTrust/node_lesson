const axios = require('axios');
const cherrio = require('cheerio');

const RedisService = require('./redis_service');
// const { MongoClient } = require('mongodb')


async function spideringArticles(count){
  const ids = await RedisService.getRandomAcfunIds(count);
  console.log('ids',ids);
  for(let id of ids){
    await getStringArticle(id)
      .catch(e=>{
          if(e.errorCode !== 4040000) throw e;
      })
    await new Promise((rsv)=>{
      setTimeout(rsv, 1000);
    })
  }
}

async function getStringArticle(id){
//   const db = await MongoClient.connect('mongodb://localhost:27017/acfun')

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

  console.log(content)

  /*
  await db.collection('articles').findOneAndUpdate({
      acfunid:id
    },{
      acfunid: id,
      content: content,
      articleContentHtml: articleContent,
      createAt: Date.now().valueOf()
    },
    {upsert: true, returnNewValue: true});
  */

  function getTextOrImg(doms,arr){
    doms.each(function(i,ele){
        if(ele.tagName === 'p'){
            // console.log($(ele).text())
            arr.push($(ele).text())
            let children = $(ele).children();
            children.each(function(i2,ele2){
                console.log('--'+i,i2, ele2.tagName)
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
    console.log(d[0].tagName)
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
