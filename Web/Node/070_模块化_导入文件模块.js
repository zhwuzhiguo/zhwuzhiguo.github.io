// require 导入自己的模块使用相对路径且不能省略“./”
// const math = require('./module/module01.js');

// require 导入js文件可以省略扩展名
const math = require('./module/module01');

console.log(math.add(1, 2));
console.log(math.sub(1, 2));
console.log(math.mul(1, 2));
console.log(math.div(1, 2));


// require 导入json文件
// 直接返回对象
// const data01 = require('./module/data01.json');

// require 导入json文件也可以省略扩展名
const data01 = require('./module/data01');

console.log('data01:', data01);
console.log('data01.id:', data01.id);
console.log('data01.name:', data01.name);
