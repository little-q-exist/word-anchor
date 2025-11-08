/**
 * @fileoverview 一个包含中英文单词对的数组。
 * 每个单词都是一个对象，包含英文和中文属性。
 */

// 定义一个名为 words 的常量数组
const words = [
    { eng: "hello", ch: "你好" },
    { eng: "world", ch: "世界" },
    { eng: "javascript", ch: "JavaScript" },
    { eng: "computer", ch: "计算机" },
    { eng: "programming", ch: "编程" },
    { eng: "array", ch: "数组" },
    { eng: "object", ch: "对象" },
    { eng: "function", ch: "函数" },
    { eng: "variable", ch: "变量" },
    { eng: "goodbye", ch: "再见" }
];

// 使用 ES6 的 export 语法导出这个数组，
// 以便其他模块可以导入使用。
export default words;
