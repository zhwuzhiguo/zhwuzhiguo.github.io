// 导入 fs 模块
const fs = require('fs');

// 文件删除
fs.unlink('./fs/test1.txt', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('unlink completed.');
});

console.log('unlink ok.');


// 文件删除
fs.rm('./fs/test2.txt', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('rm completed.');
});

console.log('rm ok.');



// 文件删除同步
fs.unlinkSync('./fs/test3.txt')
fs.rmSync('./fs/test4.txt')
