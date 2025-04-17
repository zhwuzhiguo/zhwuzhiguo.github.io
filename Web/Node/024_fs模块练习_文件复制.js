// 导入 fs 模块
const fs = require('fs');

// 流式复制文件
// 每次读取 64KB 的数据
// 整个处理过程中使用内存可控
const readStream = fs.createReadStream('./fs/test.txt');
const writeStream = fs.createWriteStream('./fs/test2.txt');

// 监听流的事件
readStream.on('data', (chunk) => {
    console.log('readStream: ', chunk.toString());
    writeStream.write(chunk);
});

readStream.on('end', () => {
    console.log('readStream end.');
    readStream.close();
    writeStream.close();
});

// 查看内存使用
const process = require('process');
console.log('process.memoryUsage:', process.memoryUsage());

// process.memoryUsage: {
//     rss: 30859264, // 占用内存
//     heapTotal: 5525504,
//     heapUsed: 4180496,
//     external: 1449111,
//     arrayBuffers: 10515
// }