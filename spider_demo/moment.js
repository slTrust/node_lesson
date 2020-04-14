const moment = require('moment');



var value = Date.now().valueOf() - 56*60*1000;
console.log(value)
var format = moment(value).format('YYYY年MM月DD日 hh:mm:ss'); 
console.log(format)


var format2 = moment(new Date('2017-4-2')).format('YYYY年MM月DD日 hh:mm:ss'); 
console.log(format2)

