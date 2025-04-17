// 导入 fs 模块
const fs = require('fs');

// // 创建文件夹
// fs.mkdir('./fs/temp', (err) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log('mkdir completed.');
// });


// // 创建文件夹-递归创建
// fs.mkdir('./fs/temp1/temp11/temp111', {recursive: true}, (err) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log('mkdir completed.');
// });

// 读取文件夹
fs.readdir('./fs', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('readdir: ', data);
});

// rmdir是老方法不建议再使用
// // 删除文件夹
// fs.rmdir('./fs/temp', (err) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log('rmdir completed.');
// });

// // 删除文件夹-递归删除
// fs.rmdir('./fs/temp1', {recursive: true}, (err) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log('rmdir completed.');
// });


// 删除文件夹
fs.rm('./fs/temp', {recursive: true}, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('rm completed.');
});

// 删除文件夹-递归删除
fs.rm('./fs/temp1', {recursive: true}, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('rm completed.');
});