// 导入 fs 模块
const fs = require('fs');

// 写文件
// 异步读文件
const buffer1 = fs.readFile('./fs/test.txt', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('readFile ok.');
    console.log('readFile: ', data.toString());
});

console.log('readFile completed.');

// 同步读文件
const buffer = fs.readFileSync('./fs/test.txt');
console.log('readFileSync:', buffer.toString());
