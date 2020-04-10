### 爬虫项目

目标爬取 acfun.cn 的文章内容

- 其中一篇文章 https://www.acfun.cn/a/ac4127544
- 使用 axios 发请求
- 使用 cheerio 解析dom 具备 jquery的选择器功能
    - [cheerio github](https://github.com/cheeriojs/cheerio)
    - [cheerio中文文档](https://www.jianshu.com/p/629a81b4e013)


```
const axios = require('axios');
const cherrio = require('cheerio');

(async ()=>{
  const uri1 = 'http://www.acfun.cn/a/ac4127544' // 纯文
  const uri2 = 'https://www.acfun.cn/a/ac3372488' // 图文混排
  const res = await axios.get(uri2);
  const html = res.data;
  const $ = cherrio.load(html);

  /*
  3年前可以这样 选节点获取 html 
  const articleContent = $('.article-content');
  const text = articleContent.children('p').text();

  2020-04-10 的今天 网站改版了 在顶部的 script里 window.articleInfo = {}
  这个变量里放置了 文章内容的dom结构
  */

  const main = $('#main');
  const data = main.children('script').html();
  // eval("window.articleInfo = {...}") // window 是 html的全局变量这里是 node环境没有 window
  const window = {}; 
  const articleContentHTML = eval(data).parts[0].content;
  // &#x(unicode编码后的汉字)JS转换方法
  // https://blog.csdn.net/qq459932400/article/details/78957806
  /*
  unescape("&#x5927;&#x5927;".replace(/&#x/g,'%u').replace(/;/g,''))  

  "大大".replace(/[^\u0000-\u00FF]/g,function(a){return escape(a).replace(/(%u)(\w{4})/gi,"&#x$2;")})  
  */
  $('.article-content').html(articleContentHTML);
  const articleContent = $('.article-content');
  const doms = articleContent.find('p,p>img,div,div>img');
  const content = [];
  doms.map((i,d) => {
    const text = $(d).text();
    if(text){
      content.push(text);
    }else if(d.name === 'img'){
      const src = $(d).attr('src');
      content.push(src);
    }
  });
  console.log(content)


})()
  .then(r=>{
    process.exit(0);
  })
  .catch(e=>{
    console.log(e);
    process.exit(1);
  })
```