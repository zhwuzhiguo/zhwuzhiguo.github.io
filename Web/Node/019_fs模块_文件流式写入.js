// 导入 fs 模块
const fs = require('fs');

// 流式写文件
// 适合写入频繁的场景
// 创建一个可写流
const writeStream = fs.createWriteStream('./fs/test.txt');

// 监听流的事件
writeStream.on('finish', () => {
    console.log('writeStream finished.');
});
writeStream.on('error', (err) => {
    console.error(err);
});
writeStream.on('close', () => {
    console.log('writeStream closed.');
});

// 写入数据
writeStream.write('11111');
writeStream.write('22222');
writeStream.write('33333');
writeStream.end();


// 关闭流
writeStream.close();
