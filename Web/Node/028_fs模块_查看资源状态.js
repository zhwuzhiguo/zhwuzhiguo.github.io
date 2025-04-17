// 导入 fs 模块
const fs = require('fs');

// 读取文件夹
fs.stat('./fs/test.txt', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('stat: ', data);
    console.log('data.isDirectory: ', data.isDirectory());
    console.log('data.isFile: ', data.isFile());
});
