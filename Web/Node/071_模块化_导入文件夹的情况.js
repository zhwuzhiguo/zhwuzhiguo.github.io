// 如果导入的是个文件夹，
// 检查文件夹下 package.json 中 main 属性对应的文件，存在导入不存在报错。
// 如果 package.json 不存在 或 main 属性不存在，则尝试导入文件夹下的 index.js 或 index.json，如果这俩个文件都不存在，则报错。

// 这个规则需要熟悉，包管理工具导入的就是文件夹。

// 另外：
// 导入 node.js 内部模块时，直接模块名就可以，无需指定后缀名和 "./" 。


const m = require('./module');
console.log(m);


