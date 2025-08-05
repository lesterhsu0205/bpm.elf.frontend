const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production', // 'production', 'development', 'none'
  devtool: false,
  entry: './src/chromeComponent.js',
  output: {
    path: path.resolve(__dirname, 'chrome_extension'),
    filename: 'elf-chrome-component.js',
    library: 'ELFChromeComponent',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { browsers: ['> 1%', 'last 2 versions'] } }],
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
            plugins: [
              '@babel/plugin-transform-class-properties',
              // 移除 @babel/plugin-transform-runtime 以避免運行時依賴
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  externals: {
    // 如果老系統已經有這些依賴，可以設為 external
    // 'react': 'React',
    // 'react-dom': 'ReactDOM'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NEXT_PUBLIC_WEB_COMPONENT_URL': `"${process.env.NEXT_PUBLIC_WEB_COMPONENT_URL}"`,
    }),
  ],
  optimization: {
    minimize: true,
  },
}
