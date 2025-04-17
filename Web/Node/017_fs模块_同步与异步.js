// 导入 fs 模块
const fs = require('fs');

// 写文件
// 异步写文件
fs.writeFile('./fs/test.txt', 'abcde', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('writeFile ok.');
});

console.log('writeFile completed.');

// 同步写文件
fs.writeFileSync('./fs/test.txt', '12345');
console.log('writeFileSync ok.');
