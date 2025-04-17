// 导入 fs 模块
const fs = require('fs');

// 追加异步写文件
fs.appendFile('./fs/test.txt', 'aaaaa', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('appendFile ok.');
});

console.log('appendFile completed.');

// 追加同步写文件
fs.appendFileSync('./fs/test.txt', 'bbbbb');
console.log('appendFileSync ok.');
