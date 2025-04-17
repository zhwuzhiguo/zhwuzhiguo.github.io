// 导入 fs 模块
const fs = require('fs');

// 流式读文件
// 每次读取 64KB 的数据
const readStream = fs.createReadStream('./fs/test.txt');

// 监听流的事件
readStream.on('data', (chunk) => {
    console.log('readStream: ', chunk.toString());
});

readStream.on('end', () => {
    console.log('readStream end.');
    readStream.close();
});
