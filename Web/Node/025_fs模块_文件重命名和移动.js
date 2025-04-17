// 导入 fs 模块
const fs = require('fs');

// 文件重命名和移动


// 文件重命名和移动同步
fs.renameSync('./fs/test2.txt', './fs/test3.txt');
console.log('renameSync ok.');

// 文件重命名和移动异步
fs.rename('./fs/test3.txt', './fs/test4.txt', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('rename completed.');
});

console.log('rename ok.');
