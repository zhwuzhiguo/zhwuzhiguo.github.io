// 导入 fs 模块
const fs = require('fs');

// 相对路径和绝对路径
fs.writeFileSync('./fs/test1.txt', '12345');
fs.writeFileSync('/Users/wuzhiguo/github/zhwuzhiguo.github.io/Web/Node/fs/test2.txt', '12345');
