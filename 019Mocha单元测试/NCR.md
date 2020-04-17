### NCR 数字字符引用

就是很早以前utf-8出现之前网页的国内的网页大部分是 gbk 等

具体原因参考我[这篇](https://sltrust.github.io/2017/09/22/N002_%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%98%AF%E5%A6%82%E4%BD%95%E5%AD%98%E6%95%B0%E6%8D%AE%E7%9A%84/)内容 

- [维基百科](https://en.wikipedia.org/wiki/Numeric_character_reference)
- [&#x(unicode编码后的汉字)JS转换方法](https://blog.csdn.net/qq459932400/article/details/78957806)
- 你也可以这样，基本解决大部分问题。而且现在基本都是 `utf-8`了
```
unescape("&#x5927;&#x5927;".replace(/&#x/g,'%u').replace(/;/g,''))  

"大大".replace(/[^\u0000-\u00FF]/g,function(a){return escape(a).replace(/(%u)(\w{4})/gi,"&#x$2;")})  
```