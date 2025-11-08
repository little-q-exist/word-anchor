/**
 * @fileoverview 一个包含中英文单词对的数组。
 * 每个单词都是一个对象，包含英文和中文属性。
 */

// 定义一个名为 words 的常量数组
const words = [
    { eng: "hello", ch: "你好", master: 0 },
    { eng: "world", ch: "世界", master: 0 },
    { eng: "javascript", ch: "JavaScript", master: 0 },
    { eng: "computer", ch: "计算机", master: 0 },
    { eng: "programming", ch: "编程", master: 0 },
    { eng: "array", ch: "数组", master: 0 },
    { eng: "object", ch: "对象", master: 0 },
    { eng: "function", ch: "函数", master: 0 },
    { eng: "variable", ch: "变量", master: 0 },
    { eng: "goodbye", ch: "再见", master: 0 }
];

// 使用 ES6 的 export 语法导出这个数组，
// 以便其他模块可以导入使用。
export default words;
