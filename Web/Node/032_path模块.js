// 导入 fs 模块
const path = require('path');

// 路径拼接
const str = path.resolve(__dirname, 'fs/test.txt');
console.log(str);

// 操作系统路径分隔符
console.log(path.sep);


// 解析返回路径对象
console.log(path.parse(str));
// {
//     root: '/',
//     dir: '/Users/wuzhiguo/github/zhwuzhiguo.github.io/Web/Node/fs',
//     base: 'test.txt',
//     ext: '.txt',
//     name: 'test'
// }

// 路径文件名
console.log(path.basename(str));
// 路径目录名
console.log(path.dirname(str));
// 路径文件扩展名
console.log(path.extname(str));