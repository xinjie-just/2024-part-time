// 官网配置文件 [Configuration File](https://prettier.io/docs/en/configuration.html)
module.exports = {
  printWidth: 120, // 每行代码长度，默认是 80，官方建议不要超过 120，即 80-120 之间即可
  semi: true, // 申明后使用分号, 默认true
  vueIndentScriptAndStyle: true,
  singleQuote: true, // 使用单引号, 默认 false
  trailingComma: 'all', // 在 ES5 中有效的结尾逗号（对象，数组等）
  proseWrap: 'never', // 散文（文本，和 markdown 有关）折行，默认 preserve (保持)
  htmlWhitespaceSensitivity: 'strict', // 指定HTML文件的全局空白区域敏感度
  endOfLine: 'auto', // 指定结尾的类型，lf | rc | crlf | auto ，默认值auto
  useTabs: false // 在 ES5 中有效的结尾逗号（对象，数组等）
}
