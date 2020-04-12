const axios = require('axios');
const cherrio = require('cheerio');

const RedisService = require('./redis_service');
const { MongoClient } = require('mongodb')
const moment = require('moment');
let client;
let db;


class Tag {
  constructor(name, value, score){
    this.name = name; // 标签 如 漫画 
    this.value = value; // 对应的值
    this.scroe = score;
  }
}

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

  const title = $('.art-title').children('.art-title-head').children('.caption').text();
  let orginCreateAtStr = $('.up-time').text();
  if(orginCreateAtStr.indexOf('小时')!=-1){
    var hour = parseInt(orginCreateAtStr);
    orginCreateAtStr =  Date.now().valueOf() - hour*60*60*1000;
  }else if(orginCreateAtStr.indexOf('分钟')!=-1){
    var minutes = parseInt(orginCreateAtStr);
    orginCreateAtStr =  Date.now().valueOf() - minutes*60*1000;
  }
  const orginCreateAt = moment(orginCreateAtStr).valueOf(); 
  const tags = [];
  const articleCategoryAndTagNames = $('.article-parent').children('a')
  const bottomTags = $('#bd_tag.tag > span');

  //面包屑a标签  文章 > 漫画文学 > 漫画
  tags.push(new Tag('ARTICLE_CATEGORY',articleCategoryAndTagNames.eq(1).text(),1));
  tags.push(new Tag('ARTICLE_TAG_NAME',articleCategoryAndTagNames.eq(2).text(),1));
  tags.push(new Tag('ARTICLE_TAG_SYS',articleCategoryAndTagNames.eq(2).text(),1));

  bottomTags.each((idx,span)=>{
    tags.push(new Tag('ARTICLE_TAG_USER',$(span).text(),1));
  })
  console.log(title, orginCreateAt,tags)
  
  const content = getTextOrImg(doms,[]);

  // console.log(content)
  const article = {
    acfunid: id,
    content: content ,
    articleContentHtml: articleContentHTML,
    createAt: Date.now().valueOf(),
    orginCreateAt: orginCreateAt ,// 文章创建时间
    title: title, //文章标题
    tags: tags,
  }
  console.log(article);
  const result = await db.collection('articles')
    .findOneAndUpdate({
      acfunid:id
    },
    {$set:article},
    {
      upsert: true, 
      returnNewValue: true
    });
  console.log('updated')
  return result;

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
