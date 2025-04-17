// node 中的不能访问 dom 和 bom
// console.log(window); // undefined
// console.log(document); // undefined

// node 中的顶级对象
console.log(global);
console.log(globalThis);
console.log(globalThis === global);
