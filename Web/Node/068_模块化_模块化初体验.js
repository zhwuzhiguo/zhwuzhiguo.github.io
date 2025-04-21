// require 函数返回对象： module.exports
const math = require('./module/module01.js');
console.log('math:', math);

console.log(math.add(1, 2));
console.log(math.sub(1, 2));
console.log(math.mul(1, 2));
console.log(math.div(1, 2));
