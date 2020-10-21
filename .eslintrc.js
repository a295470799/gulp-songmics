/* eslint-disable */
module.exports = {
  extends: [],
  globals: {
    Component: true,
    App: true,
    Page: true
  },
  // parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    amd: true
    // es6: true
  },
  rules: {
    'indent': [0, 4], // 4个空格作为代码缩进
    "no-proto": 2,
    //不要重复申明一个变量
    "no-redeclare": 2,
  }
};
