const http = require('http');
const url = require('url');

// 创建 HTTP 服务器
const server = http.createServer((request, response) => {
    // 获取请求信息
    console.log('request.method: ', request.method);
    console.log('request.url: ', request.url);
    console.log('request.httpVersion: ', request.httpVersion);
    console.log('request.headers: ', request.headers);
    console.log('request.headers.host: ', request.headers.host);
    console.log('request.headers[host]: ', request.headers['host']);

    // 获取请求路径和参数
    let urlObj = url.parse(request.url, true);
    console.log('urlObj: ', urlObj);
    
   
    // 获取请求路径和参数
    const myURL = new URL(request.url, 'https://example.org/');
    console.log('myURL: ', myURL);
    console.log('myURL.pathname: ', myURL.pathname);
    console.log('myURL.searchParams: ', myURL.searchParams);
    console.log('myURL.searchParams.get(aa): ', myURL.searchParams.get('aa'));
    console.log('myURL.searchParams.get(bbb): ', myURL.searchParams.get('bb'));


    // 获取请求体
    let body = '';
    // 监听请求体数据
    request.on('data', (chunk) => {
        body += chunk.toString();
    });

    // 监听请求体数据结束
    request.on('end', () => {
        console.log('request body: ', body);

        let bodyObj = JSON.parse(body);
        bodyObj.age = 20;
        
        // 设置响应头
        response.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
        });

        // 响应数据
        response.end(JSON.stringify(bodyObj));
    });

});


// 监听端口 
server.listen(3000, () => {
    console.log('服务(3000)启动成功...');
});