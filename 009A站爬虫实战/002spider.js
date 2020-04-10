const axios = require('axios');
const cherrio = require('cheerio');

(async ()=>{
  const uri1 = 'http://www.acfun.cn/a/ac4127544' // 纯文
  const uri2 = 'https://www.acfun.cn/a/ac3372488' // 图文混排
  const res = await axios.get(uri2);
  const html = res.data;
  const $ = cherrio.load(html);

  const main = $('#main');
  const data = main.children('script').html();
  const window = {}; 
  const articleContentHTML = eval(data).parts[0].content;

  $('.article-content').html(articleContentHTML);
  const articleContent = $('.article-content');
  const doms = articleContent.children();
  const content = getTextOrImg(doms,[]);

  console.log(content)
  
  function getTextOrImg(dom,arr){
    const d = $(dom);
    let children = d.children()
    if(d.text()){
        console.log(1.1,d.text())
        arr.push(d.text())
    } 
    if(children.length === 0){
        console.log(1)
        
        if(d[0].tagName === 'img'){
            console.log(1.2)
            arr.push(d.attr('src'))
        }
    }else{
        console.log(2)
        for(let i=0;i<children.length;i++){
            const child = children[i];
            console.log(2,i,child.children.length)
            getTextOrImg(child,arr);
        }
    }
    return arr;
  }


})()
  .then(r=>{
    process.exit(0);
  })
  .catch(e=>{
    console.log(e);
    process.exit(1);
  })

