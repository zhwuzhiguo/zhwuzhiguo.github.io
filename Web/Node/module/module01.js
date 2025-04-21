function add(a, b) {
    return a + b;    
}

function subtract(a, b) {
    return a - b;    
}

function mul(a, b) {
    return a * b;    
}

function divide(a, b) {
    return a / b;    
}


// module.exports 
// 导出模块内容

// 导出方法一
// 重置导出内容
module.exports = {
    add: add,
    sub: subtract
};

// 导出方法二
// 追加导出内容
module.exports.mul = mul;
module.exports.div = divide;
