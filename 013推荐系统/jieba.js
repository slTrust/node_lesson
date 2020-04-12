const jieba = require('nodejieba');

const r = jieba.cut('南京市长江大桥')
const str = jieba.cut('我是拖拉机学院手扶拖拉机专业的。不用多久，我就会升职加薪，当时CEO,走上人生巅峰。');
// 提取5个比较重要的词
const str2 = jieba.extract('我是拖拉机学院手扶拖拉机专业的。不用多久，我就会升职加薪，当时CEO,走上人生巅峰。',5) 
console.log(r);
console.log(str);
console.log(str2);