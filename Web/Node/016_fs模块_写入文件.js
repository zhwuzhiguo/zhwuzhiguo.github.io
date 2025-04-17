// 导入 fs 模块
const fs = require('fs');

// 写文件
fs.writeFile('./fs/test.txt', 'abcde', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('File write ok.');
});
