// Buffer 内置模块
// Buffer 是 Node.js 中用于处理二进制数据的类

// Buffer 创建
const buffer1 = Buffer.alloc(10); // 缓冲区清零
const buffer2 = Buffer.allocUnsafe(10); // 缓冲区不清零速度更快
const buffer3 = Buffer.from("abcd"); // 字符串转 Buffer (utf-8)
const buffer4 = Buffer.from([0x61, 0x62, 0x63, 0x64]);  // 数组转 Buffer

// Buffer 打印(16进制)
console.log(buffer1);
console.log(buffer2);
console.log(buffer3);
console.log(buffer4);

// Buffer 的长度
console.log(buffer1.length);
console.log(buffer2.length);
console.log(buffer3.length);
console.log(buffer4.length);

// Buffer 转字符串(utf-8)
console.log(buffer1.toString());
console.log(buffer2.toString());
console.log(buffer3.toString());
console.log(buffer4.toString());

// Buffer 元素访问
// Buffer 是类数组对象
const buffer5 = Buffer.from("abcde");

// 获取 Buffer 中的值
console.log(buffer5[0].toString(2));    // 字节转数字(2进制)
console.log(buffer5[0].toString(10));   // 字节转数字(10进制)
console.log(buffer5[0].toString(16));   // 字节转数字(16进制)

// 修改 Buffer 中的值
buffer5[1] = 0x66;
buffer5[2] = 0x66;
buffer5[3] = 0x66;
console.log(buffer5.toString());

// Buffer 处理中文
const buffer6 = Buffer.from("我");
console.log(buffer6);
console.log(buffer6.length);
console.log(buffer6.toString());
