const stylistic = require('@stylistic/eslint-plugin')

const customized = stylistic.configs.customize({
  // the following options are the default values
  indent: 2,
  quotes: 'single',
  semi: false,
  jsx: true,
  // 你可以根據團隊偏好調整這些設定
})

module.exports = {
  extends: ['next/core-web-vitals', 'plugin:@stylistic/disable-legacy'],
  plugins: [
    '@stylistic',
  ],
  rules: {
    ...customized.rules,
    // 你可以在這裡添加其他自定義規則
    // 例如：
    // '@stylistic/indent': ['error', 2],
    // '@stylistic/quotes': ['error', 'single'],
  },
}
