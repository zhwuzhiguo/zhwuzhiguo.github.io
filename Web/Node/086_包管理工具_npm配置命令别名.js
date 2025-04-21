
// 配置命令别名
// 1. 在package.json中配置命令别名
// {
//     "name": "test",
//     "version": "1.0.0",
//     "description": "a test",
//     "main": "index.js",
//     "scripts": {
//       "test": "echo \"Error: no test specified\" && exit 1",
//       // 命令别名
//       "runmon": "nodemon ./index.js"
//       // 命令别名
//       "start": "nodemon ./index.js"
//     },
//     "author": "",
//     "license": "ISC",
//     "dependencies": {
//       "express": "^5.1.0"
//     },
//     "devDependencies": {
//       "less": "^4.3.0"
//     }
// }


// 2. 在命令行中使用别名（命令在当前目录找不到会向上级目录寻找）
// npm run runmon
// start 别名可以省略 run (常用)
// npm run start
// npm start
