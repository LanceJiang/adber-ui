module.exports = {
  presets: [
    '@vue/app'
  ]
  // todo: 该文件中进行配置 babel ENV 无法执行 后续有空 再研究该问题（使用babelrc方案处理）
  /* 'env': {
    'utils': {
      'presets': [
        [
          'env',
          {
            'loose': true,
            'modules': 'commonjs',
            'targets': {
              'browsers': ['> 1%', 'last 2 versions', 'not ie <= 8']
            }
          }
        ]
      ],
      'plugins': [
        ['module-resolver', {
          'root': ['adber-ui'],
          'alias': {
            '@adber/adber-ui/src': '@adber/adber-ui/lib'
          }
        }]
      ]
    }
  } */
  // 使用这个 插件由于  cli-plugin-babel 内部 引入 jsx 的插件版本是 vue-3 的 提示 报错 暂不配置改选项
  // plugins: [
  //   '@vue/babel-plugin-jsx'
  // ]
}
